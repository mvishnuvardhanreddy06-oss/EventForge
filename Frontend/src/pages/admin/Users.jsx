import React, { useState, useEffect, useMemo } from 'react';
import { authService } from '../../services/api';
import UserSummaryCard from '../../components/admin/users/UserSummaryCard';
import UserFilterBar from '../../components/admin/users/UserFilterBar';
import UserTable from '../../components/admin/users/UserTable';
import UserDetailsDrawer from '../../components/admin/users/UserDetailsDrawer';
import AddUserModal from '../../components/admin/users/AddUserModal';
import EditUserModal from '../../components/admin/users/EditUserModal';
import ConfirmationModal from '../../components/admin/users/ConfirmationModal';
import Pagination from '../../components/admin/users/Pagination';
import EmptyState from '../../components/admin/users/EmptyState';
import {
  Users as UsersIcon,
  UserCheck,
  Clock,
  Ban,
  UserPlus,
  ShieldCheck
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [orgFilter, setOrgFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal & Drawer State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    type: 'suspend',
    user: null
  });

  const fetchLiveUsers = async () => {
    setLoading(true);
    try {
      const res = await authService.getUsers({});
      const rawList = res?.data?.users || res?.users || [];
      if (Array.isArray(rawList)) {
        const mapped = rawList.map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          organization: u.organizationId?.name || (u.role === 'admin' ? 'EventForge Platform' : 'Independent'),
          status: u.isActive !== false ? 'active' : 'suspended',
          joined: new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          lastActive: u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : 'Active'
        }));
        setUsers(mapped);
      }
    } catch (err) {
      console.error('Failed to load users from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveUsers();
  }, []);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, orgFilter, statusFilter, dateFilter]);

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const nameMatch = u.name.toLowerCase().includes(q);
        const emailMatch = u.email.toLowerCase().includes(q);
        if (!nameMatch && !emailMatch) return false;
      }

      // Role filter
      if (roleFilter !== 'All') {
        if (u.role.toLowerCase() !== roleFilter.toLowerCase()) return false;
      }

      // Organization filter
      if (orgFilter !== 'All') {
        const orgName = (u.organization || '').toLowerCase();
        if (!orgName.includes(orgFilter.toLowerCase())) return false;
      }

      // Status filter
      if (statusFilter !== 'All') {
        if (u.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }

      // Date Joined filter
      if (dateFilter !== 'All') {
        if (dateFilter === 'this_month' && !u.joined?.includes('Sep')) return false;
        if (dateFilter === 'last_month' && !u.joined?.includes('Aug')) return false;
        if (dateFilter === 'earlier' && !u.joined?.includes('Jul')) return false;
      }

      return true;
    });
  }, [users, search, roleFilter, orgFilter, statusFilter, dateFilter]);

  // Summary Card Metrics (Dynamic calculation reflecting full corporate state)
  const metrics = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === 'active').length;
    const pending = users.filter((u) => u.status === 'pending').length;
    const suspended = users.filter((u) => u.status === 'suspended').length;
    return { total, active, pending, suspended };
  }, [users]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Handlers
  const handleClearFilters = () => {
    setSearch('');
    setRoleFilter('All');
    setOrgFilter('All');
    setStatusFilter('All');
    setDateFilter('All');
    setCurrentPage(1);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleOpenSuspendModal = (user) => {
    if (user.role === 'admin') return; // Protected
    setConfirmModalState({
      isOpen: true,
      type: 'suspend',
      user
    });
  };

  const handleOpenActivateModal = (user) => {
    setConfirmModalState({
      isOpen: true,
      type: 'activate',
      user
    });
  };

  const handleConfirmAction = async (user) => {
    try {
      await authService.toggleUserStatus(user.id);
      const nextStatus = confirmModalState.type === 'suspend' ? 'suspended' : 'active';
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
      );
      if (selectedUser && selectedUser.id === user.id) {
        setSelectedUser((prev) => ({ ...prev, status: nextStatus }));
      }
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    } finally {
      setConfirmModalState({ isOpen: false, type: 'suspend', user: null });
    }
  };

  const handleAddUser = (newUser) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleSaveUser = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    if (selectedUser && selectedUser.id === updatedUser.id) {
      setSelectedUser(updatedUser);
    }
  };

  const hasActiveFilters = search || roleFilter !== 'All' || orgFilter !== 'All' || statusFilter !== 'All' || dateFilter !== 'All';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans select-text">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Platform Users
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage users, roles and account access across the EventForge platform.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddUserOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add User</span>
        </button>
      </div>

      {/* 2. SUMMARY CARDS (4 Compact Metric Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <UserSummaryCard
          label="TOTAL USERS"
          count={metrics.total}
          subtext="All registered platform users"
          icon={UsersIcon}
          color="bg-blue-50 text-blue-600"
          active={roleFilter === 'All' && statusFilter === 'All'}
          onClick={handleClearFilters}
        />
        <UserSummaryCard
          label="ACTIVE USERS"
          count={metrics.active}
          subtext="Users currently active"
          icon={UserCheck}
          color="bg-emerald-50 text-emerald-600"
          active={statusFilter === 'active'}
          onClick={() => {
            handleClearFilters();
            setStatusFilter('active');
          }}
        />
        <UserSummaryCard
          label="PENDING"
          count={metrics.pending}
          subtext="Accounts awaiting verification"
          icon={Clock}
          color="bg-amber-50 text-amber-600"
          active={statusFilter === 'pending'}
          onClick={() => {
            handleClearFilters();
            setStatusFilter('pending');
          }}
        />
        <UserSummaryCard
          label="SUSPENDED"
          count={metrics.suspended}
          subtext="Accounts currently suspended"
          icon={Ban}
          color="bg-rose-50 text-rose-600"
          active={statusFilter === 'suspended'}
          onClick={() => {
            handleClearFilters();
            setStatusFilter('suspended');
          }}
        />
      </div>

      {/* 3. SEARCH & MULTI-DIMENSION FILTER BAR */}
      <UserFilterBar
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        orgFilter={orgFilter}
        onOrgFilterChange={setOrgFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        totalFiltered={filteredUsers.length}
        totalCount={users.length}
      />

      {/* 4. USER MANAGEMENT TABLE / MOBILE CARDS */}
      {paginatedUsers.length === 0 ? (
        <EmptyState onClearFilters={handleClearFilters} />
      ) : (
        <>
          <UserTable
            users={paginatedUsers}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onSuspend={handleOpenSuspendModal}
            onActivate={handleOpenActivateModal}
          />

          {/* 5. PAGINATION */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* 6. MODALS & DRAWERS */}
      <UserDetailsDrawer
        user={selectedUser}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedUser(null);
        }}
        onEdit={(user) => {
          setIsDetailsOpen(false);
          handleEditUser(user);
        }}
        onSuspend={(user) => {
          setIsDetailsOpen(false);
          handleOpenSuspendModal(user);
        }}
        onActivate={(user) => {
          setIsDetailsOpen(false);
          handleOpenActivateModal(user);
        }}
      />

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAddUser={handleAddUser}
      />

      <EditUserModal
        user={selectedUser}
        isOpen={isEditUserOpen}
        onClose={() => {
          setIsEditUserOpen(false);
          setSelectedUser(null);
        }}
        onSaveUser={handleSaveUser}
      />

      <ConfirmationModal
        isOpen={confirmModalState.isOpen}
        type={confirmModalState.type}
        user={confirmModalState.user}
        onClose={() => setConfirmModalState({ isOpen: false, type: 'suspend', user: null })}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default Users;
