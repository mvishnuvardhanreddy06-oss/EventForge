import React, { useState, useMemo } from 'react';
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

const INITIAL_SUBSCRIPTIONS = [
  {
    id: 'sub-1',
    orgName: 'Apex Global Events',
    email: 'billing@apexevents.com',
    plan: 'Pro',
    status: 'Active',
    billingCycle: 'Monthly',
    amount: '₹4,999',
    startDate: 'Aug 01, 2026',
    renewalDate: 'Oct 01, 2026',
    usage: { users: { current: 24, max: 50, percent: 48 }, events: { current: 8, max: 20, percent: 40 }, storage: { current: '12 GB', max: '50 GB', percent: 24 } },
    history: [
      { date: 'Aug 01, 2026', event: 'Subscription activated' },
      { date: 'Sep 01, 2026', event: 'Payment received (₹4,999)' },
      { date: 'Sep 10, 2026', event: 'Plan usage updated' }
    ]
  },
  {
    id: 'sub-2',
    orgName: 'Nexus Tech Summits',
    email: 'finance@nexus.io',
    plan: 'Enterprise',
    status: 'Active',
    billingCycle: 'Yearly',
    amount: '₹49,999',
    startDate: 'Jul 15, 2026',
    renewalDate: 'Jul 15, 2027',
    usage: { users: { current: 84, max: 200, percent: 42 }, events: { current: 18, max: 50, percent: 36 }, storage: { current: '85 GB', max: '500 GB', percent: 17 } },
    history: [
      { date: 'Jul 15, 2026', event: 'Enterprise agreement executed' },
      { date: 'Jul 16, 2026', event: 'Annual wire payment received' }
    ]
  },
  {
    id: 'sub-3',
    orgName: 'TechWorld Solutions',
    email: 'contact@techworld.ai',
    plan: 'Free',
    status: 'Active',
    billingCycle: '-',
    amount: '₹0',
    startDate: 'Aug 22, 2026',
    renewalDate: '-',
    usage: { users: { current: 2, max: 5, percent: 40 }, events: { current: 1, max: 2, percent: 50 }, storage: { current: '1 GB', max: '5 GB', percent: 20 } },
    history: [{ date: 'Aug 22, 2026', event: 'Free tier activated' }]
  },
  {
    id: 'sub-4',
    orgName: 'Global Connect',
    email: 'ops@globalconnect.org',
    plan: 'Pro',
    status: 'Trial',
    billingCycle: 'Monthly',
    amount: '₹4,999',
    startDate: 'Sep 01, 2026',
    renewalDate: 'Sep 30, 2026',
    usage: { users: { current: 6, max: 50, percent: 12 }, events: { current: 2, max: 20, percent: 10 }, storage: { current: '4 GB', max: '50 GB', percent: 8 } },
    history: [{ date: 'Sep 01, 2026', event: '14-Day Pro Trial initiated' }]
  },
  {
    id: 'sub-5',
    orgName: 'CloudScale Dynamics',
    email: 'admin@cloudscale.net',
    plan: 'Pro',
    status: 'Active',
    billingCycle: 'Monthly',
    amount: '₹4,999',
    startDate: 'Aug 10, 2026',
    renewalDate: 'Oct 10, 2026',
    usage: { users: { current: 19, max: 50, percent: 38 }, events: { current: 6, max: 20, percent: 30 }, storage: { current: '22 GB', max: '50 GB', percent: 44 } },
    history: [{ date: 'Aug 10, 2026', event: 'Pro tier activated' }, { date: 'Sep 10, 2026', event: 'Recurring invoice paid' }]
  },
  {
    id: 'sub-6',
    orgName: 'InnovateX Labs',
    email: 'billing@innovatex.tech',
    plan: 'Enterprise',
    status: 'Active',
    billingCycle: 'Monthly',
    amount: '₹14,999',
    startDate: 'Jun 01, 2026',
    renewalDate: 'Oct 01, 2026',
    usage: { users: { current: 48, max: 200, percent: 24 }, events: { current: 12, max: 50, percent: 24 }, storage: { current: '64 GB', max: '500 GB', percent: 12.8 } },
    history: [{ date: 'Jun 01, 2026', event: 'Monthly Enterprise billing started' }, { date: 'Sep 01, 2026', event: 'Automated card charge successful' }]
  },
  {
    id: 'sub-7',
    orgName: 'FutureTech AI',
    email: 'finance@futuretech.ae',
    plan: 'Enterprise',
    status: 'Active',
    billingCycle: 'Yearly',
    amount: '₹49,999',
    startDate: 'Jan 10, 2026',
    renewalDate: 'Jan 10, 2027',
    usage: { users: { current: 95, max: 200, percent: 47.5 }, events: { current: 24, max: 50, percent: 48 }, storage: { current: '140 GB', max: '500 GB', percent: 28 } },
    history: [{ date: 'Jan 10, 2026', event: 'Annual subscription contract booked' }]
  },
  {
    id: 'sub-8',
    orgName: 'Horizon Media Group',
    email: 'accounts@horizonmedia.net',
    plan: 'Pro',
    status: 'Active',
    billingCycle: 'Monthly',
    amount: '₹4,999',
    startDate: 'Jul 05, 2026',
    renewalDate: 'Oct 05, 2026',
    usage: { users: { current: 14, max: 50, percent: 28 }, events: { current: 5, max: 20, percent: 25 }, storage: { current: '16 GB', max: '50 GB', percent: 32 } },
    history: [{ date: 'Jul 05, 2026', event: 'Pro subscription converted' }]
  },
  {
    id: 'sub-9',
    orgName: 'Global Summit Co',
    email: 'info@globalsummit.com',
    plan: 'Enterprise',
    status: 'Active',
    billingCycle: 'Monthly',
    amount: '₹14,999',
    startDate: 'May 20, 2026',
    renewalDate: 'Oct 20, 2026',
    usage: { users: { current: 62, max: 200, percent: 31 }, events: { current: 15, max: 50, percent: 30 }, storage: { current: '110 GB', max: '500 GB', percent: 22 } },
    history: [{ date: 'May 20, 2026', event: 'Enterprise agreement activated' }]
  },
  {
    id: 'sub-10',
    orgName: 'Alpha Enterprise Systems',
    email: 'support@alphasys.co',
    plan: 'Enterprise',
    status: 'Expired',
    billingCycle: 'Yearly',
    amount: '₹49,999',
    startDate: 'Aug 15, 2025',
    renewalDate: 'Aug 15, 2026',
    usage: { users: { current: 18, max: 200, percent: 9 }, events: { current: 4, max: 50, percent: 8 }, storage: { current: '25 GB', max: '500 GB', percent: 5 } },
    history: [{ date: 'Aug 15, 2025', event: 'Contract established' }, { date: 'Aug 15, 2026', event: 'Contract expired without auto-renewal' }]
  },
  {
    id: 'sub-11',
    orgName: 'Quantum Innovations',
    email: 'team@quantuminnovations.io',
    plan: 'Pro',
    status: 'Trial',
    billingCycle: 'Monthly',
    amount: '₹4,999',
    startDate: 'Sep 05, 2026',
    renewalDate: 'Oct 05, 2026',
    usage: { users: { current: 4, max: 50, percent: 8 }, events: { current: 1, max: 20, percent: 5 }, storage: { current: '3 GB', max: '50 GB', percent: 6 } },
    history: [{ date: 'Sep 05, 2026', event: 'Trial environment deployed' }]
  },
  {
    id: 'sub-12',
    orgName: 'ByteCraft Technologies',
    email: 'devops@bytecraft.io',
    plan: 'Pro',
    status: 'Active',
    billingCycle: 'Monthly',
    amount: '₹4,999',
    startDate: 'Aug 18, 2026',
    renewalDate: 'Oct 18, 2026',
    usage: { users: { current: 28, max: 50, percent: 56 }, events: { current: 9, max: 20, percent: 45 }, storage: { current: '34 GB', max: '50 GB', percent: 68 } },
    history: [{ date: 'Aug 18, 2026', event: 'Pro subscription enabled' }]
  },
  {
    id: 'sub-13',
    orgName: 'SummitWave Events',
    email: 'billing@summitwave.com',
    plan: 'Pro',
    status: 'Expired',
    billingCycle: 'Monthly',
    amount: '₹4,999',
    startDate: 'Jul 01, 2026',
    renewalDate: 'Sep 01, 2026',
    usage: { users: { current: 12, max: 50, percent: 24 }, events: { current: 3, max: 20, percent: 15 }, storage: { current: '10 GB', max: '50 GB', percent: 20 } },
    history: [{ date: 'Jul 01, 2026', event: 'Subscribed to Pro' }, { date: 'Sep 01, 2026', event: 'Grace period ended, plan expired' }]
  },
  {
    id: 'sub-14',
    orgName: 'Luminary Conferences',
    email: 'events@luminaryconf.com',
    plan: 'Pro',
    status: 'Trial',
    billingCycle: 'Monthly',
    amount: '₹4,999',
    startDate: 'Sep 12, 2026',
    renewalDate: 'Oct 12, 2026',
    usage: { users: { current: 8, max: 50, percent: 16 }, events: { current: 2, max: 20, percent: 10 }, storage: { current: '5 GB', max: '50 GB', percent: 10 } },
    history: [{ date: 'Sep 12, 2026', event: 'Trial registered' }]
  },
  {
    id: 'sub-15',
    orgName: 'AgileCorp Media',
    email: 'payments@agilecorp.com',
    plan: 'Pro',
    status: 'Active',
    billingCycle: 'Monthly',
    amount: '₹4,999',
    startDate: 'Aug 25, 2026',
    renewalDate: 'Oct 25, 2026',
    usage: { users: { current: 21, max: 50, percent: 42 }, events: { current: 7, max: 20, percent: 35 }, storage: { current: '26 GB', max: '50 GB', percent: 52 } },
    history: [{ date: 'Aug 25, 2026', event: 'Pro tier activated' }]
  },
  {
    id: 'sub-16',
    orgName: 'SyncSphere Labs',
    email: 'contact@syncsphere.org',
    plan: 'Free',
    status: 'Active',
    billingCycle: '-',
    amount: '₹0',
    startDate: 'Aug 01, 2026',
    renewalDate: '-',
    usage: { users: { current: 2, max: 5, percent: 40 }, events: { current: 1, max: 2, percent: 50 }, storage: { current: '0.8 GB', max: '5 GB', percent: 16 } },
    history: [{ date: 'Aug 01, 2026', event: 'Free tier activated' }]
  },
  {
    id: 'sub-17',
    orgName: 'DevPulse Global',
    email: 'info@devpulse.io',
    plan: 'Free',
    status: 'Active',
    billingCycle: '-',
    amount: '₹0',
    startDate: 'Aug 05, 2026',
    renewalDate: '-',
    usage: { users: { current: 3, max: 5, percent: 60 }, events: { current: 2, max: 2, percent: 100 }, storage: { current: '2.1 GB', max: '5 GB', percent: 42 } },
    history: [{ date: 'Aug 05, 2026', event: 'Free tier activated' }]
  },
  {
    id: 'sub-18',
    orgName: 'NextGen Horizons',
    email: 'team@nextgenhorizons.com',
    plan: 'Free',
    status: 'Active',
    billingCycle: '-',
    amount: '₹0',
    startDate: 'Aug 12, 2026',
    renewalDate: '-',
    usage: { users: { current: 1, max: 5, percent: 20 }, events: { current: 1, max: 2, percent: 50 }, storage: { current: '1.2 GB', max: '5 GB', percent: 24 } },
    history: [{ date: 'Aug 12, 2026', event: 'Free tier activated' }]
  },
  {
    id: 'sub-19',
    orgName: 'Pinnacle Gatherings',
    email: 'admin@pinnaclegatherings.com',
    plan: 'Free',
    status: 'Active',
    billingCycle: '-',
    amount: '₹0',
    startDate: 'Aug 14, 2026',
    renewalDate: '-',
    usage: { users: { current: 4, max: 5, percent: 80 }, events: { current: 2, max: 2, percent: 100 }, storage: { current: '3.4 GB', max: '5 GB', percent: 68 } },
    history: [{ date: 'Aug 14, 2026', event: 'Free tier activated' }]
  },
  {
    id: 'sub-20',
    orgName: 'CyberGuard Summit',
    email: 'contact@cyberguardsummit.eu',
    plan: 'Free',
    status: 'Active',
    billingCycle: '-',
    amount: '₹0',
    startDate: 'Aug 19, 2026',
    renewalDate: '-',
    usage: { users: { current: 2, max: 5, percent: 40 }, events: { current: 1, max: 2, percent: 50 }, storage: { current: '1.5 GB', max: '5 GB', percent: 30 } },
    history: [{ date: 'Aug 19, 2026', event: 'Free tier activated' }]
  },
  {
    id: 'sub-21',
    orgName: 'OrbitLink Systems',
    email: 'hello@orbitlink.io',
    plan: 'Free',
    status: 'Active',
    billingCycle: '-',
    amount: '₹0',
    startDate: 'Aug 24, 2026',
    renewalDate: '-',
    usage: { users: { current: 3, max: 5, percent: 60 }, events: { current: 1, max: 2, percent: 50 }, storage: { current: '2.0 GB', max: '5 GB', percent: 40 } },
    history: [{ date: 'Aug 24, 2026', event: 'Free tier activated' }]
  },
  {
    id: 'sub-22',
    orgName: 'EchoVentures Inc',
    email: 'billing@echoventures.org',
    plan: 'Free',
    status: 'Active',
    billingCycle: '-',
    amount: '₹0',
    startDate: 'Aug 29, 2026',
    renewalDate: '-',
    usage: { users: { current: 1, max: 5, percent: 20 }, events: { current: 1, max: 2, percent: 50 }, storage: { current: '0.9 GB', max: '5 GB', percent: 18 } },
    history: [{ date: 'Aug 29, 2026', event: 'Free tier activated' }]
  },
  {
    id: 'sub-23',
    orgName: 'VectorCore Events',
    email: 'ops@vectorcore.com',
    plan: 'Free',
    status: 'Active',
    billingCycle: '-',
    amount: '₹0',
    startDate: 'Sep 02, 2026',
    renewalDate: '-',
    usage: { users: { current: 2, max: 5, percent: 40 }, events: { current: 1, max: 2, percent: 50 }, storage: { current: '1.8 GB', max: '5 GB', percent: 36 } },
    history: [{ date: 'Sep 02, 2026', event: 'Free tier activated' }]
  },
  {
    id: 'sub-24',
    orgName: 'DataStream Tech',
    email: 'accounts@datastreamtech.io',
    plan: 'Free',
    status: 'Active',
    billingCycle: '-',
    amount: '₹0',
    startDate: 'Sep 08, 2026',
    renewalDate: '-',
    usage: { users: { current: 3, max: 5, percent: 60 }, events: { current: 1, max: 2, percent: 50 }, storage: { current: '2.4 GB', max: '5 GB', percent: 48 } },
    history: [{ date: 'Sep 08, 2026', event: 'Free tier activated' }]
  }
];


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
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planToast, setPlanToast] = useState(null);

  const handleSavePlan = (updatedPlan) => {
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

  const handleConfirmChangePlan = (id, newPlan) => {
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
