import React, { useState, useMemo, useEffect } from 'react';
import { subscriptionService } from '../../services/api';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  RefreshCw
} from 'lucide-react';
import SubscriptionSummaryCard from '../../components/admin/subscriptions/SubscriptionSummaryCard';
import RevenueChart from '../../components/admin/subscriptions/RevenueChart';
import RevenueBreakdown from '../../components/admin/subscriptions/RevenueBreakdown';
import PlanDistribution from '../../components/admin/subscriptions/PlanDistribution';
import UpcomingRenewals from '../../components/admin/subscriptions/UpcomingRenewals';
import SubscriptionFilters from '../../components/admin/subscriptions/SubscriptionFilters';
import SubscriptionTable from '../../components/admin/subscriptions/SubscriptionTable';
import SubscriptionDetailsDrawer from '../../components/admin/subscriptions/SubscriptionDetailsDrawer';
import CreateSubscriptionModal from '../../components/admin/subscriptions/CreateSubscriptionModal';
import ChangePlanModal from '../../components/admin/subscriptions/ChangePlanModal';
import CancelSubscriptionModal from '../../components/admin/subscriptions/CancelSubscriptionModal';
import EditPlanModal from '../../components/admin/subscriptions/EditPlanModal';
import Pagination from '../../components/admin/subscriptions/Pagination';

const INITIAL_SUBSCRIPTIONS = [];

const INITIAL_PLANS = [
  {
    id: 'plan-free',
    name: 'Free',
    tag: 'Starter tier',
    description: 'For small teams getting started with EventForge.',
    price: 0,
    currency: 'INR',
    billingPeriod: 'Forever',
    status: 'Active',
    isPopular: false,
    limits: {
      events: 3,
      users: 100,
      organizations: 10,
      unlimitedEvents: false,
      unlimitedUsers: false
    },
    features: [
      'Up to 3 Events',
      'Up to 100 Users',
      'Basic Event Management',
      'Basic Analytics',
      'Community Support'
    ],
    settings: {
      aiFeatures: false,
      customBranding: false,
      prioritySupport: false
    },
    usage: {
      organizations: 10,
      users: 18,
      events: 4
    }
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    tag: 'Growing teams',
    description: 'For growing organizations managing multiple events.',
    price: 4999,
    currency: 'INR',
    billingPeriod: 'Monthly',
    status: 'Active',
    isPopular: true,
    limits: {
      events: 20,
      users: 50,
      organizations: 10,
      unlimitedEvents: false,
      unlimitedUsers: false
    },
    features: [
      'Up to 20 Events',
      'Up to 50 Users',
      'Advanced Analytics',
      'AI-Powered Features',
      'Custom Branding',
      'Priority Support'
    ],
    settings: {
      aiFeatures: true,
      customBranding: true,
      prioritySupport: true
    },
    usage: {
      organizations: 9,
      users: 42,
      events: 18
    }
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    tag: 'Large organizations',
    description: 'For large organizations with advanced requirements.',
    price: 14999,
    currency: 'INR',
    billingPeriod: 'Monthly',
    status: 'Active',
    isPopular: false,
    limits: {
      events: 0,
      users: 0,
      organizations: 10,
      unlimitedEvents: true,
      unlimitedUsers: true
    },
    features: [
      'Unlimited Events',
      'Unlimited Users',
      'Advanced Analytics',
      'Full AI Suite',
      'Custom Branding',
      'Priority Support',
      'Dedicated Account Support'
    ],
    settings: {
      aiFeatures: true,
      customBranding: true,
      prioritySupport: true
    },
    usage: {
      organizations: 5,
      users: 84,
      events: 32
    }
  }
];

const ITEMS_PER_PAGE = 10;

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planToast, setPlanToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptionsAndPlans = async () => {
    setLoading(true);
    try {
      const [plansRes, orgsRes] = await Promise.allSettled([
        subscriptionService.getPlans(),
        subscriptionService.getOrganizations()
      ]);

      if (plansRes.status === 'fulfilled') {
        const rawPlans = plansRes.value?.data?.plans || plansRes.value?.plans;
        if (Array.isArray(rawPlans) && rawPlans.length > 0) {
          setPlans(rawPlans.map(p => ({
            id: p._id || p.id,
            name: p.name,
            tag: p.name === 'Enterprise' ? 'Full platform' : p.name === 'Pro' ? 'Growing teams' : 'Starter tier',
            description: p.description || `For ${p.name.toLowerCase()} tier teams.`,
            price: p.price,
            currency: 'INR',
            billingPeriod: p.billingPeriod || 'Monthly',
            status: p.status === 'active' ? 'Active' : p.status,
            isPopular: p.name === 'Pro',
            limits: p.limits || {},
            features: p.features || [],
            settings: {
              aiFeatures: p.features?.some(f => f.toLowerCase().includes('ai')) || false,
              customBranding: p.features?.some(f => f.toLowerCase().includes('brand')) || false,
              prioritySupport: p.features?.some(f => f.toLowerCase().includes('support')) || false
            },
            usage: {
              organizations: p.subscriberCount || 0,
              users: 0,
              events: 0
            }
          })));
        }
      }

      if (orgsRes.status === 'fulfilled') {
        const rawSubs = orgsRes.value?.data?.subscriptions || orgsRes.value?.subscriptions;
        if (Array.isArray(rawSubs)) {
          setSubscriptions(rawSubs.map(s => ({
            id: s.orgId || s._id,
            orgId: s.orgId || s._id,
            orgName: s.orgName,
            email: s.email,
            plan: s.plan || 'Free',
            status: s.status === 'active' ? 'Active' : 'Suspended',
            billingCycle: s.billingCycle || 'Monthly',
            amount: s.plan === 'Enterprise' ? '₹14,999' : s.plan === 'Pro' ? '₹4,999' : '₹0',
            startDate: new Date(s.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            renewalDate: s.renewalDate ? new Date(s.renewalDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Next Month',
            usage: { users: { current: 1, max: 50, percent: 2 }, events: { current: 1, max: 20, percent: 5 }, storage: { current: '1 GB', max: '50 GB', percent: 2 } },
            history: [{ date: 'Active', event: 'Organization active subscription' }]
          })));
        }
      }
    } catch (err) {
      console.error('Failed to load subscriptions from server:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionsAndPlans();
  }, []);

  const handleSavePlan = async (updatedPlan) => {
    try {
      if (updatedPlan.id) {
        await subscriptionService.updatePlan(updatedPlan.id, {
          price: updatedPlan.price,
          limits: updatedPlan.limits,
          features: updatedPlan.features,
          status: (updatedPlan.status || 'active').toLowerCase()
        });
      }
      setPlans((prev) =>
        prev.map((p) => {
          if (p.id === updatedPlan.id) {
            return updatedPlan;
          }
          if (updatedPlan.isPopular && p.isPopular) {
            return { ...p, isPopular: false };
          }
          return p;
        })
      );
      setEditingPlan(null);
      setPlanToast('✓ Subscription plan updated successfully.');
      setTimeout(() => {
        setPlanToast(null);
      }, 3500);
    } catch (err) {
      console.error('Failed to update plan:', err);
      setPlanToast('Error updating plan on backend.');
      setTimeout(() => setPlanToast(null), 3500);
    }
  };

  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [billingFilter, setBillingFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedSub, setSelectedSub] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useMemo(() => {
    setCurrentPage(1);
  }, [search, planFilter, statusFilter, billingFilter]);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchName = sub.orgName.toLowerCase().includes(q);
        const matchEmail = (sub.email || '').toLowerCase().includes(q);
        const matchPlan = sub.plan.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPlan) return false;
      }
      if (planFilter !== 'All') {
        if (sub.plan.toLowerCase() !== planFilter.toLowerCase()) return false;
      }
      if (statusFilter !== 'All') {
        if (sub.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }
      if (billingFilter !== 'All') {
        if (sub.billingCycle.toLowerCase() !== billingFilter.toLowerCase()) return false;
      }
      return true;
    });
  }, [subscriptions, search, planFilter, statusFilter, billingFilter]);

  const metrics = useMemo(() => {
    const total = subscriptions.length;
    const active = subscriptions.filter((s) => s.status.toLowerCase() === 'active').length;
    const trial = subscriptions.filter((s) => s.status.toLowerCase() === 'trial').length;
    const expired = subscriptions.filter((s) => s.status.toLowerCase() === 'expired').length;
    return { total, active, trial, expired };
  }, [subscriptions]);

  const totalPages = Math.ceil(filteredSubscriptions.length / ITEMS_PER_PAGE) || 1;
  const paginatedSubscriptions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubscriptions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSubscriptions, currentPage]);

  const hasActiveFilters = Boolean(
    search.trim() || planFilter !== 'All' || statusFilter !== 'All' || billingFilter !== 'All'
  );

  const handleClearFilters = () => {
    setSearch('');
    setPlanFilter('All');
    setStatusFilter('All');
    setBillingFilter('All');
    setCurrentPage(1);
  };

  const handleView = (sub) => {
    setSelectedSub(sub);
    setIsDetailsOpen(true);
  };

  const handleOpenChangePlan = (sub) => {
    setSelectedSub(sub);
    setIsChangePlanOpen(true);
  };

  const handleOpenCancel = (sub) => {
    setSelectedSub(sub);
    setIsCancelModalOpen(true);
  };

  const handleConfirmChangePlan = async (id, newPlan) => {
    try {
      await subscriptionService.changeOrganizationPlan(id, newPlan);
      setSubscriptions((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          let amount = s.amount;
          if (newPlan === 'Free') amount = '₹0';
          else if (newPlan === 'Pro') amount = '₹4,999';
          else if (newPlan === 'Enterprise') amount = '₹14,999';
          return {
            ...s,
            plan: newPlan,
            amount: amount,
            history: [
              { date: 'Today, 2026', event: `Plan modified to ${newPlan}` },
              ...(s.history || [])
            ]
          };
        })
      );
      if (selectedSub && selectedSub.id === id) {
        setSelectedSub((prev) => ({ ...prev, plan: newPlan }));
      }
    } catch (err) {
      console.error('Failed to change organization plan:', err);
    }
  };

  const handleConfirmCancel = (id) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'Cancelled',
              history: [
                { date: 'Today, 2026', event: 'Subscription cancelled by Platform Admin' },
                ...(s.history || [])
              ]
            }
          : s
      )
    );
    if (selectedSub && selectedSub.id === id) {
      setSelectedSub((prev) => ({ ...prev, status: 'Cancelled' }));
    }
  };

  const handleRenew = (sub) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === sub.id
          ? {
              ...s,
              status: 'Active',
              renewalDate: 'Nov 01, 2026',
              history: [
                { date: 'Today, 2026', event: 'Subscription renewed by Platform Admin' },
                ...(s.history || [])
              ]
            }
          : s
      )
    );
    if (selectedSub && selectedSub.id === sub.id) {
      setSelectedSub((prev) => ({ ...prev, status: 'Active', renewalDate: 'Nov 01, 2026' }));
    }
  };

  const handleConvertToPro = (sub) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === sub.id
          ? {
              ...s,
              plan: 'Pro',
              status: 'Active',
              amount: '₹4,999',
              renewalDate: 'Oct 17, 2026',
              history: [
                { date: 'Today, 2026', event: 'Converted from Trial to Active Pro Plan' },
                ...(s.history || [])
              ]
            }
          : s
      )
    );
    if (selectedSub && selectedSub.id === sub.id) {
      setSelectedSub((prev) => ({
        ...prev,
        plan: 'Pro',
        status: 'Active',
        amount: '₹4,999',
        renewalDate: 'Oct 17, 2026'
      }));
    }
  };

  const handleConvertToEnterprise = (sub) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === sub.id
          ? {
              ...s,
              plan: 'Enterprise',
              status: 'Active',
              amount: '₹14,999',
              renewalDate: 'Oct 17, 2026',
              history: [
                { date: 'Today, 2026', event: 'Converted from Trial to Enterprise Tier' },
                ...(s.history || [])
              ]
            }
          : s
      )
    );
    if (selectedSub && selectedSub.id === sub.id) {
      setSelectedSub((prev) => ({
        ...prev,
        plan: 'Enterprise',
        status: 'Active',
        amount: '₹14,999',
        renewalDate: 'Oct 17, 2026'
      }));
    }
  };

  const handleCreateSubscription = (newSub) => {
    setSubscriptions((prev) => [newSub, ...prev]);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage organization plans, billing status and subscription activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Subscription</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SubscriptionSummaryCard
          title="TOTAL SUBSCRIPTIONS"
          value={metrics.total}
          description="Across all organizations"
          icon={CreditCard}
          trend="+3 this month"
          trendType="positive"
        />
        <SubscriptionSummaryCard
          title="ACTIVE"
          value={metrics.active}
          description="Paid & renewing"
          icon={CheckCircle2}
          trend="94.2% retention"
          trendType="positive"
        />
        <SubscriptionSummaryCard
          title="TRIAL"
          value={metrics.trial}
          description="14-day evaluation"
          icon={Clock}
          trend="3 active evaluations"
          trendType="neutral"
        />
        <SubscriptionSummaryCard
          title="EXPIRED"
          value={metrics.expired}
          description="Grace period ended"
          icon={AlertTriangle}
          trend="Action required"
          trendType="warning"
        />
      </div>

      {/* ANALYTICS & REVENUE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="space-y-4">
          <RevenueBreakdown />
          <UpcomingRenewals
            onViewAll={() => {
              setSearch('Apex');
            }}
          />
        </div>
      </div>

      {/* SUBSCRIPTION PLANS SECTION (Three Premium Rectangular Cards) */}
      <PlanDistribution
        plans={plans}
        onEditPlan={(plan) => {
          setEditingPlan(plan);
        }}
      />

      <div className="space-y-4">
        <SubscriptionFilters
          search={search}
          onSearchChange={setSearch}
          planFilter={planFilter}
          onPlanFilterChange={setPlanFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          billingFilter={billingFilter}
          onBillingFilterChange={setBillingFilter}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          totalFiltered={filteredSubscriptions.length}
          totalCount={subscriptions.length}
        />

        {filteredSubscriptions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                No subscriptions found
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Try changing your filters or search terms.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100/80 border border-blue-200/60 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        ) : (
          <div>
            <SubscriptionTable
              subscriptions={paginatedSubscriptions}
              onView={handleView}
              onChangePlan={handleOpenChangePlan}
              onCancel={handleOpenCancel}
              onRenew={handleRenew}
              onConvertToPro={handleConvertToPro}
              onConvertToEnterprise={handleConvertToEnterprise}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredSubscriptions.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <SubscriptionDetailsDrawer
        subscription={selectedSub}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onChangePlan={handleOpenChangePlan}
        onCancel={handleOpenCancel}
        onRenew={handleRenew}
        onConvertToPro={handleConvertToPro}
        onConvertToEnterprise={handleConvertToEnterprise}
      />

      <CreateSubscriptionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        existingSubscriptions={subscriptions}
        onCreate={handleCreateSubscription}
      />

      <ChangePlanModal
        subscription={selectedSub}
        isOpen={isChangePlanOpen}
        onClose={() => setIsChangePlanOpen(false)}
        onConfirmChange={handleConfirmChangePlan}
      />

      <CancelSubscriptionModal
        subscription={selectedSub}
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirmCancel={handleConfirmCancel}
      />

      <EditPlanModal
        isOpen={Boolean(editingPlan)}
        onClose={() => setEditingPlan(null)}
        plan={editingPlan}
        allPlans={plans}
        onSavePlan={handleSavePlan}
      />

      {/* Floating Toast Notification */}
      {planToast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="flex items-center space-x-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold bg-slate-900 text-white border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{planToast}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
