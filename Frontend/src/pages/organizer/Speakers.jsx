import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Send,
  Calendar,
  Layers,
  Users,
  Search,
  ChevronDown,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { speakerService } from '../../services/api';

// Components
import SpeakerSummaryCards from '../../components/organizer/speakers/SpeakerSummaryCards';
import SpeakerToolbar from '../../components/organizer/speakers/SpeakerToolbar';
import SpeakerGrid from '../../components/organizer/speakers/SpeakerGrid';
import SpeakerList from '../../components/organizer/speakers/SpeakerList';
import SpeakerProfileDrawer from '../../components/organizer/speakers/SpeakerProfileDrawer';
import SpeakerFormModal from '../../components/organizer/speakers/SpeakerFormModal';
import InviteSpeakerModal from '../../components/organizer/speakers/InviteSpeakerModal';
import AssignSessionModal from '../../components/organizer/speakers/AssignSessionModal';
import MaterialReviewModal from '../../components/organizer/speakers/MaterialReviewModal';
import RemoveSpeakerModal from '../../components/organizer/speakers/RemoveSpeakerModal';
import ResendInviteModal from '../../components/organizer/speakers/ResendInviteModal';
import EmptyState from '../../components/organizer/speakers/EmptyState';
import Pagination from '../../components/organizer/speakers/Pagination';
import ToastNotification from '../../components/organizer/speakers/ToastNotification';

const DEFAULT_AVATARS = [
  'https://upload.wikimedia.org/wikipedia/commons/1/15/Virat_Kohli_portrait.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/d6/Sundar_pichai.png',
  'https://upload.wikimedia.org/wikipedia/commons/7/78/MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/8/80/Sam_Altman_TechCrunch_Disrupt_2019_%28cropped%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/0/00/Jensen_Huang_at_Computex_2024.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/1/1d/Rohit_Sharma_portrait.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/7/70/Mahendra_Singh_Dhoni_in_January_2023.jpg',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop'
];

const INITIAL_EVENTS = [
  { id: 'all', title: 'All Events' },
  { id: 'evt-1', title: 'Global Tech Leadership Summit 2026' },
  { id: 'evt-2', title: 'AI & Cloud Innovation Conference' },
  { id: 'evt-3', title: 'FinTech Future Forum' }
];

// 32 Speakers Dataset perfectly matching KPI numbers:
// 32 Total, 24 Confirmed, 5 Pending, 3 Materials Pending, 28 Sessions Assigned
const INITIAL_SPEAKERS = [
  {
    id: 'sp-1',
    name: 'Dr. Sarah Chen',
    designation: 'VP of AI Research',
    company: 'Anthropic',
    email: 'sarah.chen@anthropic.com',
    phone: '+1 (415) 890-2101',
    profileImage: DEFAULT_AVATARS[0],
    type: 'Keynote Speaker',
    status: 'confirmed',
    availability: 'available',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/sarahchen-ai',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Dr. Sarah Chen leads foundation model alignment research at Anthropic. She previously served as Principal Scientist at Stanford HAI and is a frequent keynote presenter on scalable AI governance.',
    topics: ['Frontier Models', 'AI Alignment', 'System Safety'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-101',
        title: 'Opening Keynote: Next-Gen Autonomous AI Systems',
        type: 'Keynote',
        dateFormatted: 'Sep 24, 2026',
        startTime: '09:00',
        endTime: '10:15',
        time: '09:00 AM – 10:15 AM',
        room: 'Grand Ballroom A'
      }
    ],
    invitation: { sentAt: 'Sep 10, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 10, 2026', responseAt: 'Sep 11, 2026' }
  },
  {
    id: 'sp-2',
    name: 'Arjun Mehta',
    designation: 'Chief Technology Officer',
    company: 'Apex Global Events',
    email: 'arjun.mehta@apexevents.io',
    phone: '+1 (408) 555-0144',
    profileImage: DEFAULT_AVATARS[1],
    type: 'Keynote Speaker',
    status: 'confirmed',
    availability: 'available',
    location: 'San Jose, CA',
    linkedin: 'https://linkedin.com/in/arjunmehta-cto',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Arjun Mehta spearheads technology infrastructure for large-scale enterprise summits, focusing on real-time event telemetry and streaming microservices.',
    topics: ['Enterprise Scale', 'Microservices', 'Real-Time Telemetry'],
    materialStatus: 'pending',
    materials: { status: 'pending review', presentationStatus: 'pending review', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-102',
        title: 'Architecting Resilient Cloud Foundations',
        type: 'Talk',
        dateFormatted: 'Sep 24, 2026',
        startTime: '10:30',
        endTime: '11:45',
        time: '10:30 AM – 11:45 AM',
        room: 'Hall B'
      }
    ],
    invitation: { sentAt: 'Sep 08, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 08, 2026', responseAt: 'Sep 09, 2026' }
  },
  {
    id: 'sp-3',
    name: 'Dr. Elena Rostova',
    designation: 'Distinguished Cloud Architect',
    company: 'Google Cloud',
    email: 'elena.rostova@google.com',
    phone: '+1 (650) 253-0000',
    profileImage: DEFAULT_AVATARS[2],
    type: 'Keynote Speaker',
    status: 'confirmed',
    availability: 'available',
    location: 'Mountain View, CA',
    linkedin: 'https://linkedin.com/in/elenarostova',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Dr. Elena Rostova oversees global hybrid cloud architecture and distributed computing clusters for global tier-1 enterprises.',
    topics: ['Hybrid Cloud', 'Distributed Systems', 'Kubernetes at Scale'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-103',
        title: 'Panel: Security in an Agentic AI World',
        type: 'Panel',
        dateFormatted: 'Sep 24, 2026',
        startTime: '13:00',
        endTime: '14:30',
        time: '01:00 PM – 02:30 PM',
        room: 'Grand Ballroom B'
      }
    ],
    invitation: { sentAt: 'Sep 05, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 05, 2026', responseAt: 'Sep 06, 2026' }
  },
  {
    id: 'sp-4',
    name: 'Marcus Vance',
    designation: 'Head of Distributed Infrastructure',
    company: 'Amazon Web Services',
    email: 'm.vance@amazon.com',
    phone: '+1 (206) 266-1000',
    profileImage: DEFAULT_AVATARS[3],
    type: 'Workshop Instructor',
    status: 'confirmed',
    availability: 'available',
    location: 'Seattle, WA',
    linkedin: 'https://linkedin.com/in/marcusvance-aws',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Marcus leads serverless infrastructure initiatives, helping developers architect high-concurrency event-driven applications.',
    topics: ['Serverless Architectures', 'Event-Driven Systems', 'AWS Lambda'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-104',
        title: 'Hands-on Workshop: Scalable Microservices',
        type: 'Workshop',
        dateFormatted: 'Sep 25, 2026',
        startTime: '10:00',
        endTime: '12:30',
        time: '10:00 AM – 12:30 PM',
        room: 'Workshop Lab 1'
      }
    ],
    invitation: { sentAt: 'Sep 02, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 02, 2026', responseAt: 'Sep 03, 2026' }
  },
  {
    id: 'sp-5',
    name: 'David Kim',
    designation: 'Director of Platform Engineering',
    company: 'Snowflake',
    email: 'david.kim@snowflake.com',
    phone: '+1 (408) 987-6543',
    profileImage: DEFAULT_AVATARS[4],
    type: 'Panelist',
    status: 'confirmed',
    availability: 'partially available',
    location: 'San Mateo, CA',
    linkedin: 'https://linkedin.com/in/davidkim-platform',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'David leads data pipeline modernization and real-time analytical warehouses for multi-cloud deployments.',
    topics: ['Data Mesh', 'Cloud Data Warehouses', 'Platform Engineering'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-103',
        title: 'Panel: Security in an Agentic AI World',
        type: 'Panel',
        dateFormatted: 'Sep 24, 2026',
        startTime: '13:00',
        endTime: '14:30',
        time: '01:00 PM – 02:30 PM',
        room: 'Grand Ballroom B'
      }
    ],
    invitation: { sentAt: 'Sep 01, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 01, 2026', responseAt: 'Sep 02, 2026' }
  },
  {
    id: 'sp-6',
    name: 'Priya Sundaram',
    designation: 'Partner & Cybersecurity Fellow',
    company: 'StratVentures',
    email: 'priya.sundaram@stratventures.com',
    phone: '+1 (617) 555-7890',
    profileImage: DEFAULT_AVATARS[5],
    type: 'Keynote Speaker',
    status: 'confirmed',
    availability: 'available',
    location: 'Boston, MA',
    linkedin: 'https://linkedin.com/in/priyasundaram',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Priya advises Fortune 100 boards on zero-trust architectures, supply chain cyber resilience, and critical infrastructure defense.',
    topics: ['Zero Trust', 'Cybersecurity', 'Venture Capital'],
    materialStatus: 'pending',
    materials: { status: 'needs changes', presentationStatus: 'needs changes', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-105',
        title: 'Fireside Chat: Executive Leadership in Uncertainty',
        type: 'Keynote',
        dateFormatted: 'Sep 25, 2026',
        startTime: '14:00',
        endTime: '15:15',
        time: '02:00 PM – 03:15 PM',
        room: 'Executive Pavilion'
      }
    ],
    invitation: { sentAt: 'Aug 28, 2026', deliveryStatus: 'Accepted', openedAt: 'Aug 28, 2026', responseAt: 'Aug 30, 2026' }
  },
  {
    id: 'sp-7',
    name: 'Alexander Wright',
    designation: 'Principal Engineer',
    company: 'Microsoft Azure',
    email: 'alex.wright@microsoft.com',
    phone: '+1 (425) 882-8080',
    profileImage: DEFAULT_AVATARS[6],
    type: 'Workshop Instructor',
    status: 'confirmed',
    availability: 'available',
    location: 'Redmond, WA',
    linkedin: 'https://linkedin.com/in/alexwright-azure',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Specialist in cloud-native observability, eBPF telemetry, and multi-region failover frameworks.',
    topics: ['Observability', 'eBPF', 'Site Reliability Engineering'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-106',
        title: 'Deep Dive: eBPF-Powered Enterprise Observability',
        type: 'Workshop',
        dateFormatted: 'Sep 25, 2026',
        startTime: '13:00',
        endTime: '15:00',
        time: '01:00 PM – 03:00 PM',
        room: 'Workshop Lab 2'
      }
    ],
    invitation: { sentAt: 'Sep 02, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 02, 2026', responseAt: 'Sep 04, 2026' }
  },
  {
    id: 'sp-8',
    name: 'Maya Lin',
    designation: 'VP of Developer Experience',
    company: 'Stripe',
    email: 'maya.lin@stripe.com',
    phone: '+1 (415) 555-0912',
    profileImage: DEFAULT_AVATARS[7],
    type: 'Keynote Speaker',
    status: 'confirmed',
    availability: 'available',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/mayalin-stripe',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Maya oversees developer velocity, SDK architectures, and financial infrastructure APIs supporting millions of businesses globally.',
    topics: ['API Architecture', 'Developer Experience', 'FinTech'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-107',
        title: 'Building Modern Financial APIs at Global Scale',
        type: 'Talk',
        dateFormatted: 'Sep 25, 2026',
        startTime: '11:00',
        endTime: '12:00',
        time: '11:00 AM – 12:00 PM',
        room: 'Hall A'
      }
    ],
    invitation: { sentAt: 'Sep 03, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 03, 2026', responseAt: 'Sep 05, 2026' }
  },
  {
    id: 'sp-9',
    name: 'Carlos Rodriguez',
    designation: 'Chief Information Security Officer',
    company: 'Cloudflare',
    email: 'carlos.r@cloudflare.com',
    phone: '+1 (415) 300-8800',
    profileImage: DEFAULT_AVATARS[1],
    type: 'Panelist',
    status: 'confirmed',
    availability: 'available',
    location: 'Austin, TX',
    linkedin: 'https://linkedin.com/in/carlos-rodriguez-sec',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Oversees global perimeter defense, DDoS mitigation networks, and cryptographic standards across Cloudflare edge data centers.',
    topics: ['DDoS Mitigation', 'Edge Computing', 'Post-Quantum Crypto'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-103',
        title: 'Panel: Security in an Agentic AI World',
        type: 'Panel',
        dateFormatted: 'Sep 24, 2026',
        startTime: '13:00',
        endTime: '14:30',
        time: '01:00 PM – 02:30 PM',
        room: 'Grand Ballroom B'
      }
    ],
    invitation: { sentAt: 'Aug 29, 2026', deliveryStatus: 'Accepted', openedAt: 'Aug 29, 2026', responseAt: 'Aug 30, 2026' }
  },
  {
    id: 'sp-10',
    name: 'Sophia Martinez',
    designation: 'Chief Data Officer',
    company: 'Databricks',
    email: 'sophia.m@databricks.com',
    phone: '+1 (415) 999-1234',
    profileImage: DEFAULT_AVATARS[2],
    type: 'Keynote Speaker',
    status: 'confirmed',
    availability: 'available',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/sophiamartinez-data',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Pioneered lakehouse architecture patterns, enabling unified governance across relational and unstructured ML datasets.',
    topics: ['Lakehouse Architecture', 'Unified Governance', 'Spark ML'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-108',
        title: 'The Evolution of the Lakehouse Data Pattern',
        type: 'Keynote',
        dateFormatted: 'Sep 24, 2026',
        startTime: '15:30',
        endTime: '16:45',
        time: '03:30 PM – 04:45 PM',
        room: 'Grand Ballroom A'
      }
    ],
    invitation: { sentAt: 'Sep 04, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 04, 2026', responseAt: 'Sep 06, 2026' }
  },
  {
    id: 'sp-11',
    name: 'Nathan Ross',
    designation: 'Founder & Head of AI Systems',
    company: 'LangChain',
    email: 'nathan@langchain.dev',
    phone: '+1 (415) 789-0123',
    profileImage: DEFAULT_AVATARS[3],
    type: 'Workshop Instructor',
    status: 'confirmed',
    availability: 'available',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/nathanross-ai',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Creator of state-of-the-art developer tooling for agentic workflows, memory persistence, and tool invocation orchestration.',
    topics: ['LLM Orchestration', 'Multi-Agent Workflows', 'Agent Memory'],
    materialStatus: 'pending',
    materials: { status: 'pending review', presentationStatus: 'pending review', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-109',
        title: 'Masterclass: Orchestrating Autonomous Agent Workflows',
        type: 'Workshop',
        dateFormatted: 'Sep 25, 2026',
        startTime: '09:00',
        endTime: '11:00',
        time: '09:00 AM – 11:00 AM',
        room: 'Workshop Lab 1'
      }
    ],
    invitation: { sentAt: 'Sep 07, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 07, 2026', responseAt: 'Sep 08, 2026' }
  },
  {
    id: 'sp-12',
    name: 'Jessica Taylor',
    designation: 'Global Head of DevOps',
    company: 'Netflix',
    email: 'jtaylor@netflix.com',
    phone: '+1 (408) 540-3700',
    profileImage: DEFAULT_AVATARS[5],
    type: 'Talk',
    status: 'confirmed',
    availability: 'available',
    location: 'Los Gatos, CA',
    linkedin: 'https://linkedin.com/in/jessicataylor-devops',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Specialist in chaos engineering, resilience testing, and automated rollouts across massive subscriber streaming fleets.',
    topics: ['Chaos Engineering', 'Continuous Delivery', 'Fleet Management'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-110',
        title: 'Chaos in Production: Resilient Distributed Deployments',
        type: 'Talk',
        dateFormatted: 'Sep 25, 2026',
        startTime: '11:30',
        endTime: '12:30',
        time: '11:30 AM – 12:30 PM',
        room: 'Hall B'
      }
    ],
    invitation: { sentAt: 'Sep 01, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 01, 2026', responseAt: 'Sep 03, 2026' }
  },
  {
    id: 'sp-13',
    name: 'Vikram Patel',
    designation: 'VP of Engineering',
    company: 'Uber',
    email: 'vikram.p@uber.com',
    phone: '+1 (415) 612-5000',
    profileImage: DEFAULT_AVATARS[0],
    type: 'Talk',
    status: 'confirmed',
    availability: 'available',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/vikrampatel-eng',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Leads dynamic dispatch routing engines and real-time geospatial marketplace indexing architectures.',
    topics: ['Geospatial Systems', 'Marketplace Dispatch', 'High-Throughput IO'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-111',
        title: 'Real-time Geospatial Querying at Planetary Scale',
        type: 'Talk',
        dateFormatted: 'Sep 24, 2026',
        startTime: '14:00',
        endTime: '15:00',
        time: '02:00 PM – 03:00 PM',
        room: 'Hall A'
      }
    ],
    invitation: { sentAt: 'Sep 02, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 02, 2026', responseAt: 'Sep 04, 2026' }
  },
  {
    id: 'sp-14',
    name: 'Rachel Green',
    designation: 'Principal Architect',
    company: 'HashiCorp',
    email: 'rachel.green@hashicorp.com',
    phone: '+1 (415) 301-4400',
    profileImage: DEFAULT_AVATARS[2],
    type: 'Talk',
    status: 'confirmed',
    availability: 'available',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/rachelgreen-infra',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Authority on declarative infrastructure as code, multi-cloud networking, and automated secrets lifecycle management.',
    topics: ['Terraform', 'Secrets Lifecycle', 'Zero Trust Networking'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-112',
        title: 'Declarative Security: Hardening Cloud Footprints via Code',
        type: 'Talk',
        dateFormatted: 'Sep 24, 2026',
        startTime: '11:15',
        endTime: '12:15',
        time: '11:15 AM – 12:15 PM',
        room: 'Hall B'
      }
    ],
    invitation: { sentAt: 'Aug 30, 2026', deliveryStatus: 'Accepted', openedAt: 'Aug 30, 2026', responseAt: 'Sep 01, 2026' }
  },
  {
    id: 'sp-15',
    name: 'Daniel Foster',
    designation: 'VP of Infrastructure',
    company: 'Datadog',
    email: 'daniel.foster@datadoghq.com',
    phone: '+1 (866) 329-4466',
    profileImage: DEFAULT_AVATARS[4],
    type: 'Keynote Speaker',
    status: 'confirmed',
    availability: 'available',
    location: 'New York, NY',
    linkedin: 'https://linkedin.com/in/danielfoster-infra',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Oversees ingestion and real-time processing of trillions of telemetry events daily for global cloud platforms.',
    topics: ['Telemetry Ingestion', 'Observability Pipelines', 'Real-time Analytics'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-113',
        title: 'Streaming Trillions of Events: Ingestion Pipeline Architectures',
        type: 'Keynote',
        dateFormatted: 'Sep 25, 2026',
        startTime: '16:00',
        endTime: '17:00',
        time: '04:00 PM – 05:00 PM',
        room: 'Grand Ballroom A'
      }
    ],
    invitation: { sentAt: 'Sep 03, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 03, 2026', responseAt: 'Sep 05, 2026' }
  },
  {
    id: 'sp-16',
    name: 'Aisha Al-Mansoor',
    designation: 'Director of Emerging Technologies',
    company: 'Aramco Digital',
    email: 'aisha.mansoor@aramcodigital.com',
    phone: '+966 13 874-0111',
    profileImage: DEFAULT_AVATARS[5],
    type: 'Talk',
    status: 'confirmed',
    availability: 'available',
    location: 'Dhahran, Saudi Arabia',
    linkedin: 'https://linkedin.com/in/aisha-almansoor',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Spearheading industrial IoT deployments, computer vision for pipeline integrity, and edge analytics across energy infrastructure.',
    topics: ['Industrial IoT', 'Edge Computer Vision', 'Energy Transition'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-114',
        title: 'Edge AI in Extreme Environments: Lessons from the Field',
        type: 'Talk',
        dateFormatted: 'Sep 25, 2026',
        startTime: '14:30',
        endTime: '15:30',
        time: '02:30 PM – 03:30 PM',
        room: 'Hall B'
      }
    ],
    invitation: { sentAt: 'Sep 01, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 01, 2026', responseAt: 'Sep 03, 2026' }
  },
  {
    id: 'sp-17',
    name: 'Thomas Weber',
    designation: 'Chief AI Strategist',
    company: 'SAP',
    email: 'thomas.weber@sap.com',
    phone: '+49 6227 747474',
    profileImage: DEFAULT_AVATARS[1],
    type: 'Keynote Speaker',
    status: 'confirmed',
    availability: 'available',
    location: 'Walldorf, Germany',
    linkedin: 'https://linkedin.com/in/thomasweber-ai',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Directs enterprise generative AI integrations across global supply chain, ERP, and workforce management suites.',
    topics: ['Enterprise ERP', 'Agentic Supply Chains', 'Business AI'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-115',
        title: 'Autonomous Supply Chains: Where ERP Meets Agentic AI',
        type: 'Keynote',
        dateFormatted: 'Sep 24, 2026',
        startTime: '16:45',
        endTime: '17:45',
        time: '04:45 PM – 05:45 PM',
        room: 'Grand Ballroom A'
      }
    ],
    invitation: { sentAt: 'Sep 05, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 05, 2026', responseAt: 'Sep 07, 2026' }
  },
  {
    id: 'sp-18',
    name: 'Olivia Bennett',
    designation: 'VP of Engineering',
    company: 'Figma',
    email: 'olivia.bennett@figma.com',
    phone: '+1 (415) 800-4321',
    profileImage: DEFAULT_AVATARS[7],
    type: 'Talk',
    status: 'confirmed',
    availability: 'available',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/oliviabennett-figma',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Architect behind multiplayer collaborative engines, WebAssembly graphics rendering, and zero-latency canvas synchronization.',
    topics: ['Multiplayer CRDTs', 'WebAssembly', 'Canvas Rendering'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-116',
        title: 'Building Multiplayer WebAssembly Engines',
        type: 'Talk',
        dateFormatted: 'Sep 25, 2026',
        startTime: '10:00',
        endTime: '11:00',
        time: '10:00 AM – 11:00 AM',
        room: 'Hall A'
      }
    ],
    invitation: { sentAt: 'Sep 04, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 04, 2026', responseAt: 'Sep 05, 2026' }
  },
  {
    id: 'sp-19',
    name: 'Robert Evans',
    designation: 'Chief Architect',
    company: 'Intel Labs',
    email: 'robert.evans@intel.com',
    phone: '+1 (408) 765-8080',
    profileImage: DEFAULT_AVATARS[3],
    type: 'Talk',
    status: 'confirmed',
    availability: 'partially available',
    location: 'Santa Clara, CA',
    linkedin: 'https://linkedin.com/in/robertevans-intel',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Researches neuromorphic compute silicon, high-bandwidth memory interconnects, and next-generation datacenter power efficiency.',
    topics: ['Neuromorphic Silicon', 'HBM Interconnects', 'Datacenter Efficiency'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-117',
        title: 'Next-Gen Silicon Architectures for LLM Inference',
        type: 'Talk',
        dateFormatted: 'Sep 25, 2026',
        startTime: '15:15',
        endTime: '16:15',
        time: '03:15 PM – 04:15 PM',
        room: 'Hall B'
      }
    ],
    invitation: { sentAt: 'Sep 02, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 02, 2026', responseAt: 'Sep 04, 2026' }
  },
  {
    id: 'sp-20',
    name: 'Samantha Liu',
    designation: 'Head of Machine Learning',
    company: 'OpenAI',
    email: 'samantha.liu@openai.com',
    phone: '+1 (415) 890-4411',
    profileImage: DEFAULT_AVATARS[0],
    type: 'Keynote Speaker',
    status: 'confirmed',
    availability: 'available',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/samanthaliu-ai',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Specialist in post-training reasoning models, reinforcement learning from human feedback (RLHF), and autonomous coding assistants.',
    topics: ['Reasoning Models', 'RLHF', 'Autonomous Coding'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-118',
        title: 'The Frontier of Chain-of-Thought Reasoning Models',
        type: 'Keynote',
        dateFormatted: 'Sep 24, 2026',
        startTime: '10:30',
        endTime: '11:45',
        time: '10:30 AM – 11:45 AM',
        room: 'Grand Ballroom A'
      }
    ],
    invitation: { sentAt: 'Sep 06, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 06, 2026', responseAt: 'Sep 08, 2026' }
  },
  {
    id: 'sp-21',
    name: 'Gabriel Rossi',
    designation: 'VP of Cloud Operations',
    company: 'Spotify',
    email: 'gabriel.r@spotify.com',
    phone: '+46 8 555-0980',
    profileImage: DEFAULT_AVATARS[6],
    type: 'Talk',
    status: 'confirmed',
    availability: 'available',
    location: 'Stockholm, Sweden',
    linkedin: 'https://linkedin.com/in/gabrielrossi-ops',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Architected Backstage developer portal adoption and multi-region cloud financial engineering (FinOps) models.',
    topics: ['Internal Developer Platforms', 'FinOps', 'Multi-Region Audio Streaming'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-119',
        title: 'Developer Portals as Enterprise Scalability Catalysts',
        type: 'Talk',
        dateFormatted: 'Sep 25, 2026',
        startTime: '12:00',
        endTime: '13:00',
        time: '12:00 PM – 01:00 PM',
        room: 'Hall A'
      }
    ],
    invitation: { sentAt: 'Sep 03, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 03, 2026', responseAt: 'Sep 05, 2026' }
  },
  {
    id: 'sp-22',
    name: 'Meera Nambiar',
    designation: 'Director of Product Security',
    company: 'GitHub',
    email: 'meera.nambiar@github.com',
    phone: '+1 (415) 895-2000',
    profileImage: DEFAULT_AVATARS[5],
    type: 'Panelist',
    status: 'confirmed',
    availability: 'available',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/meeranambiar',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Author of open-source supply chain security standards, automated code remediation engines, and SLSA compliance frameworks.',
    topics: ['Software Supply Chain', 'SLSA Security', 'Automated Remediation'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-103',
        title: 'Panel: Security in an Agentic AI World',
        type: 'Panel',
        dateFormatted: 'Sep 24, 2026',
        startTime: '13:00',
        endTime: '14:30',
        time: '01:00 PM – 02:30 PM',
        room: 'Grand Ballroom B'
      }
    ],
    invitation: { sentAt: 'Aug 30, 2026', deliveryStatus: 'Accepted', openedAt: 'Aug 30, 2026', responseAt: 'Sep 01, 2026' }
  },
  {
    id: 'sp-23',
    name: 'Lucas Silva',
    designation: 'Head of Site Reliability',
    company: 'Shopify',
    email: 'lucas.silva@shopify.com',
    phone: '+1 (613) 241-2828',
    profileImage: DEFAULT_AVATARS[1],
    type: 'Talk',
    status: 'confirmed',
    availability: 'available',
    location: 'Ottawa, Canada',
    linkedin: 'https://linkedin.com/in/lucassilva-sre',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Ensures zero-downtime flash-sale elasticity for millions of global merchant storefronts on Black Friday / Cyber Monday.',
    topics: ['Flash Elasticity', 'Kubernetes Clusters', 'Zero Downtime Migrations'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-120',
        title: 'Scaling Under Massive Spikes: Cyber Monday Infrastructure Lessons',
        type: 'Talk',
        dateFormatted: 'Sep 24, 2026',
        startTime: '12:30',
        endTime: '13:30',
        time: '12:30 PM – 01:30 PM',
        room: 'Hall B'
      }
    ],
    invitation: { sentAt: 'Sep 01, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 01, 2026', responseAt: 'Sep 03, 2026' }
  },
  {
    id: 'sp-24',
    name: 'Hannah Zimmerman',
    designation: 'Chief Technology Officer',
    company: 'Siemens Healthineers',
    email: 'hannah.zimmerman@siemens.com',
    phone: '+49 9131 84-0',
    profileImage: DEFAULT_AVATARS[7],
    type: 'Keynote Speaker',
    status: 'confirmed',
    availability: 'available',
    location: 'Erlangen, Germany',
    linkedin: 'https://linkedin.com/in/hannahzimmerman-cto',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Oversees FDA-cleared healthcare AI algorithms, clinical imaging pipelines, and privacy-preserving federated diagnostic models.',
    topics: ['Healthcare AI', 'Federated Learning', 'Medical Imaging'],
    materialStatus: 'approved',
    materials: { status: 'approved', presentationStatus: 'approved', bioStatus: 'approved' },
    sessions: [
      {
        id: 'ses-121',
        title: 'Federated Learning in Regulated Healthcare Environments',
        type: 'Keynote',
        dateFormatted: 'Sep 25, 2026',
        startTime: '09:00',
        endTime: '10:00',
        time: '09:00 AM – 10:00 AM',
        room: 'Grand Ballroom A'
      }
    ],
    invitation: { sentAt: 'Sep 04, 2026', deliveryStatus: 'Accepted', openedAt: 'Sep 04, 2026', responseAt: 'Sep 06, 2026' }
  },

  // 5 Pending Speakers (3 Pending, 2 Invited)
  {
    id: 'sp-25',
    name: 'Kevin Zhang',
    designation: 'Principal Research Scientist',
    company: 'Meta FAIR',
    email: 'kevin.zhang@meta.com',
    phone: '+1 (650) 543-4800',
    profileImage: DEFAULT_AVATARS[4],
    type: 'Keynote Speaker',
    status: 'pending',
    availability: 'partially available',
    location: 'Menlo Park, CA',
    linkedin: 'https://linkedin.com/in/kevinzhang-fair',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Specialist in multimodal speech-to-speech foundation models, open weights scientific releases, and distributed training on 100k GPU clusters.',
    topics: ['Multimodal AI', 'GPU Cluster Optimization', 'Open Source Models'],
    materialStatus: 'not submitted',
    materials: { status: 'not submitted' },
    sessions: [
      {
        id: 'ses-122',
        title: 'Scaling Frontier Training Across 100,000 GPUs',
        type: 'Keynote',
        dateFormatted: 'Sep 25, 2026',
        startTime: '14:00',
        endTime: '15:00',
        time: '02:00 PM – 03:00 PM',
        room: 'Grand Ballroom A'
      }
    ],
    invitation: { sentAt: 'Sep 12, 2026', deliveryStatus: 'Opened', openedAt: 'Sep 12, 2026', responseAt: null }
  },
  {
    id: 'sp-26',
    name: 'Laura Gomez',
    designation: 'VP of Product',
    company: 'Atlassian',
    email: 'lgomez@atlassian.com',
    phone: '+1 (415) 701-1110',
    profileImage: DEFAULT_AVATARS[2],
    type: 'Talk',
    status: 'pending',
    availability: 'available',
    location: 'Austin, TX',
    linkedin: 'https://linkedin.com/in/lauragomez-pm',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Product strategist leading generative AI copilots for collaborative software development, issue triage, and knowledge management.',
    topics: ['AI for Collaboration', 'Product Strategy', 'Developer Tooling'],
    materialStatus: 'not submitted',
    materials: { status: 'not submitted' },
    sessions: [
      {
        id: 'ses-123',
        title: 'Human-AI Collaboration in Agile Software Teams',
        type: 'Talk',
        dateFormatted: 'Sep 24, 2026',
        startTime: '15:00',
        endTime: '16:00',
        time: '03:00 PM – 04:00 PM',
        room: 'Hall B'
      }
    ],
    invitation: { sentAt: 'Sep 14, 2026', deliveryStatus: 'Opened', openedAt: 'Sep 14, 2026', responseAt: null }
  },
  {
    id: 'sp-27',
    name: 'Ethan Brooks',
    designation: 'Founder & CEO',
    company: 'VectorStream',
    email: 'ethan@vectorstream.ai',
    phone: '+1 (415) 321-7654',
    profileImage: DEFAULT_AVATARS[3],
    type: 'Keynote Speaker',
    status: 'pending',
    availability: 'available',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/ethanbrooks-ai',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Serial entrepreneur pioneering GPU-accelerated vector databases for real-time semantic retrieval at sub-millisecond latencies.',
    topics: ['Vector Databases', 'GPU Indexing', 'Semantic Search'],
    materialStatus: 'not submitted',
    materials: { status: 'not submitted' },
    sessions: [], // Unassigned session 1
    invitation: { sentAt: 'Sep 15, 2026', deliveryStatus: 'Delivered', openedAt: null, responseAt: null }
  },
  {
    id: 'sp-28',
    name: 'Chloe Dupont',
    designation: 'Senior Director of AI Ethics',
    company: 'European Tech Alliance',
    email: 'chloe.dupont@eutech.org',
    phone: '+33 1 40 50 60 70',
    profileImage: DEFAULT_AVATARS[0],
    type: 'Panelist',
    status: 'invited',
    availability: 'available',
    location: 'Paris, France',
    linkedin: 'https://linkedin.com/in/chloedupont-ethics',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Advisor to European Commission working groups on the EU AI Act, transparency standards, and algorithmic impact assessments.',
    topics: ['EU AI Act', 'AI Governance', 'Algorithmic Auditing'],
    materialStatus: 'not submitted',
    materials: { status: 'not submitted' },
    sessions: [
      {
        id: 'ses-103',
        title: 'Panel: Security in an Agentic AI World',
        type: 'Panel',
        dateFormatted: 'Sep 24, 2026',
        startTime: '13:00',
        endTime: '14:30',
        time: '01:00 PM – 02:30 PM',
        room: 'Grand Ballroom B'
      }
    ],
    invitation: { sentAt: 'Sep 16, 2026', deliveryStatus: 'Delivered', openedAt: null, responseAt: null }
  },
  {
    id: 'sp-29',
    name: "Samuel O'Connor",
    designation: 'Head of Cloud Governance',
    company: 'Oracle',
    email: 'samuel.oconnor@oracle.com',
    phone: '+1 (650) 506-7000',
    profileImage: DEFAULT_AVATARS[1],
    type: 'Talk',
    status: 'invited',
    availability: 'available',
    location: 'Austin, TX',
    linkedin: 'https://linkedin.com/in/samueloconnor-cloud',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Directs sovereign cloud enclaves and compliance certifications across highly regulated financial and government sectors.',
    topics: ['Sovereign Cloud', 'Zero Trust IAM', 'Enterprise Compliance'],
    materialStatus: 'not submitted',
    materials: { status: 'not submitted' },
    sessions: [], // Unassigned session 2
    invitation: { sentAt: 'Sep 17, 2026', deliveryStatus: 'Delivered', openedAt: null, responseAt: null }
  },

  // 3 Declined Speakers (Unconfirmed)
  {
    id: 'sp-30',
    name: 'Benjamin Clarke',
    designation: 'Chief Security Architect',
    company: 'CrowdStrike',
    email: 'ben.clarke@crowdstrike.com',
    phone: '+1 (888) 512-8211',
    profileImage: DEFAULT_AVATARS[6],
    type: 'Keynote Speaker',
    status: 'declined',
    availability: 'unavailable',
    location: 'Sunnyvale, CA',
    linkedin: 'https://linkedin.com/in/benclarke-sec',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Researches endpoint threat detection, kernel-level telemetry drivers, and advanced persistent threat (APT) campaign tracking.',
    topics: ['Endpoint Security', 'Kernel Drivers', 'Threat Intelligence'],
    materialStatus: 'not submitted',
    materials: { status: 'not submitted' },
    sessions: [
      {
        id: 'ses-124',
        title: 'Endpoint Threat Modeling in Distributed Environments',
        type: 'Talk',
        dateFormatted: 'Sep 25, 2026',
        startTime: '16:00',
        endTime: '17:00',
        time: '04:00 PM – 05:00 PM',
        room: 'Hall B'
      }
    ],
    invitation: { sentAt: 'Sep 05, 2026', deliveryStatus: 'Declined', openedAt: 'Sep 06, 2026', responseAt: 'Sep 07, 2026' }
  },
  {
    id: 'sp-31',
    name: 'Nadia Kassem',
    designation: 'Fellow & Research Director',
    company: 'MIT Media Lab',
    email: 'nkassem@media.mit.edu',
    phone: '+1 (617) 253-1000',
    profileImage: DEFAULT_AVATARS[5],
    type: 'Keynote Speaker',
    status: 'declined',
    availability: 'unavailable',
    location: 'Cambridge, MA',
    linkedin: 'https://linkedin.com/in/nadiakassem',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Pioneering human-computer interface design, brain-computer interfaces (BCIs), and neurotechnology ethics.',
    topics: ['Brain-Computer Interfaces', 'HCI Design', 'Neurotechnology'],
    materialStatus: 'not submitted',
    materials: { status: 'not submitted' },
    sessions: [], // Unassigned session 3
    invitation: { sentAt: 'Sep 06, 2026', deliveryStatus: 'Declined', openedAt: 'Sep 07, 2026', responseAt: 'Sep 08, 2026' }
  },
  {
    id: 'sp-32',
    name: 'James Thorne',
    designation: 'Managing Director',
    company: 'Horizon Capital',
    email: 'jthorne@horizoncap.com',
    phone: '+44 20 7946 0991',
    profileImage: DEFAULT_AVATARS[4],
    type: 'Panelist',
    status: 'declined',
    availability: 'unavailable',
    location: 'London, UK',
    linkedin: 'https://linkedin.com/in/jamesthorne-invest',
    eventName: 'Global Tech Leadership Summit 2026',
    bio: 'Early-stage venture capitalist backing foundational deep-tech, quantum computing, and synthetic biology startups across Europe.',
    topics: ['Deep Tech Investing', 'Venture Capital', 'Quantum Computing'],
    materialStatus: 'not submitted',
    materials: { status: 'not submitted' },
    sessions: [], // Unassigned session 4
    invitation: { sentAt: 'Sep 07, 2026', deliveryStatus: 'Declined', openedAt: 'Sep 08, 2026', responseAt: 'Sep 09, 2026' }
  }
];

const Speakers = () => {
  const [speakers, setSpeakers] = useState(INITIAL_SPEAKERS);
  const [selectedEvent, setSelectedEvent] = useState('Global Tech Leadership Summit 2026');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [sessionFilter, setSessionFilter] = useState('all');
  const [materialsFilter, setMaterialsFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Modals & Drawers State
  const [profileDrawerSpeaker, setProfileDrawerSpeaker] = useState(null);
  const [formModalSpeaker, setFormModalSpeaker] = useState(null); // null = Add, obj = Edit
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [assignSessionSpeaker, setAssignSessionSpeaker] = useState(null);
  const [materialReviewData, setMaterialReviewData] = useState(null);
  const [removeSpeaker, setRemoveSpeaker] = useState(null);
  const [resendInviteSpeaker, setResendInviteSpeaker] = useState(null);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Synchronize or load from API gracefully
  useEffect(() => {
    const loadSpeakers = async () => {
      try {
        const res = await speakerService.getAll();
        const rawSpeakers = res?.data?.speakers || res?.speakers || (Array.isArray(res?.data) ? res.data : null);
        if (Array.isArray(rawSpeakers) && rawSpeakers.length > 0) {
          const apiItems = rawSpeakers.map((s, idx) => {
            const name = s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Speaker';
            let img = s.profileImage;
            if (/virat|kholi|kohli/i.test(name)) {
              img = 'https://upload.wikimedia.org/wikipedia/commons/1/15/Virat_Kohli_portrait.jpg';
            } else if (!img || img.includes('unsplash.com/photo-1534528741775') || img.includes('unsplash.com/photo-1500648767791')) {
              img = DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length];
            }
            return {
              ...s,
              id: s._id || s.id,
              name,
              designation: s.designation || s.title || 'Keynote Speaker',
              company: s.company || 'Enterprise Partner',
              email: s.email || '',
              phone: s.phone || '',
              profileImage: img,
              type: s.type || 'Speaker',
              status: s.status || 'confirmed',
              availability: s.availability || 'available',
              materialStatus: s.materialStatus || 'approved',
              sessions: s.sessions || s.assignedSessions || []
            };
          });
          setSpeakers(apiItems);
        }
      } catch (err) {
        console.error('Error fetching speakers from database:', err);
      }
    };
    loadSpeakers();
  }, []);

  // Summary Metrics: Exact counts 32, 24, 5, 3, 28
  const stats = useMemo(() => {
    const total = speakers.length;
    const confirmed = speakers.filter((s) => s.status === 'confirmed').length;
    const pending = speakers.filter((s) => s.status === 'pending' || s.status === 'invited').length;
    const materialsPending = speakers.filter(
      (s) =>
        s.materialStatus === 'pending' ||
        s.materialStatus === 'pending review' ||
        s.materialStatus === 'needs changes' ||
        s.materials?.status === 'pending review' ||
        s.materials?.status === 'needs changes'
    ).length;
    const sessionsAssigned = speakers.filter(
      (s) => (s.sessions && s.sessions.length > 0) || (s.assignedSessions && s.assignedSessions.length > 0)
    ).length;

    return { total, confirmed, pending, materialsPending, sessionsAssigned };
  }, [speakers]);

  // Handle Summary Card Click-to-Filter
  const handleSummaryCardFilter = (filterType, filterValue) => {
    if (filterType === 'status') {
      setStatusFilter(filterValue === statusFilter ? 'all' : filterValue);
    } else if (filterType === 'materials') {
      setMaterialsFilter(materialsFilter === 'pending' ? 'all' : 'pending');
    }
    setCurrentPage(1);
  };

  // Filter speakers based on all active criteria
  const filteredSpeakers = useMemo(() => {
    return speakers.filter((sp) => {
      // Event Selector (Header dropdown)
      if (selectedEvent !== 'All Events') {
        const matchesSelected = (sp.eventName || sp.event) === selectedEvent;
        if (!matchesSelected && eventFilter === 'all') {
          // If viewing specific event in main switcher
          return false;
        }
      }

      // Event Filter dropdown
      if (eventFilter !== 'all') {
        const spEvent = sp.eventName || sp.event || '';
        if (!spEvent.toLowerCase().includes(eventFilter.toLowerCase())) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (sp.name || '').toLowerCase().includes(q);
        const compMatch = (sp.company || '').toLowerCase().includes(q);
        const titleMatch = (sp.designation || '').toLowerCase().includes(q);
        const sessionMatch = (sp.sessions || []).some((s) => (s.title || '').toLowerCase().includes(q));
        if (!nameMatch && !compMatch && !titleMatch && !sessionMatch) {
          return false;
        }
      }

      // Status Filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'pending') {
          if (sp.status !== 'pending' && sp.status !== 'invited') return false;
        } else if (sp.status !== statusFilter) {
          return false;
        }
      }

      // Session Filter
      if (sessionFilter !== 'all') {
        const hasSessions = (sp.sessions && sp.sessions.length > 0) || (sp.assignedSessions && sp.assignedSessions.length > 0);
        if (sessionFilter === 'Assigned' && !hasSessions) return false;
        if (sessionFilter === 'Unassigned' && hasSessions) return false;
        if (sessionFilter !== 'Assigned' && sessionFilter !== 'Unassigned') {
          const matchTitle = (sp.sessions || []).some((s) => s.title === sessionFilter);
          if (!matchTitle) return false;
        }
      }

      // Materials Filter
      if (materialsFilter !== 'all') {
        const matStatus = sp.materialStatus || sp.materials?.status || 'not submitted';
        if (materialsFilter === 'submitted' && matStatus !== 'approved' && matStatus !== 'submitted') {
          return false;
        }
        if (materialsFilter === 'pending' && matStatus !== 'pending' && matStatus !== 'pending review' && matStatus !== 'needs changes') {
          return false;
        }
      }

      // Availability Filter
      if (availabilityFilter !== 'all') {
        if (sp.availability !== availabilityFilter) return false;
      }

      return true;
    });
  }, [
    speakers,
    selectedEvent,
    eventFilter,
    searchQuery,
    statusFilter,
    sessionFilter,
    materialsFilter,
    availabilityFilter
  ]);

  // Paginated Slice
  const paginatedSpeakers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSpeakers.slice(start, start + pageSize);
  }, [filteredSpeakers, currentPage, pageSize]);

  // Check if any filters are actively narrowing results
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    eventFilter !== 'all' ||
    sessionFilter !== 'all' ||
    materialsFilter !== 'all' ||
    availabilityFilter !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setEventFilter('all');
    setSessionFilter('all');
    setMaterialsFilter('all');
    setAvailabilityFilter('all');
    setCurrentPage(1);
  };

  // Distinct sessions list for the toolbar dropdown
  const allDistinctSessions = useMemo(() => {
    const list = [{ title: 'Assigned' }, { title: 'Unassigned' }];
    const seen = new Set();
    speakers.forEach((s) => {
      (s.sessions || []).forEach((ses) => {
        if (!seen.has(ses.title)) {
          seen.add(ses.title);
          list.push({ title: ses.title });
        }
      });
    });
    return list;
  }, [speakers]);

  // Handlers for Add/Edit
  const handleOpenAdd = () => {
    setFormModalSpeaker(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (speaker) => {
    setFormModalSpeaker(speaker);
    setIsFormModalOpen(true);
  };

  const handleSaveSpeaker = async (speakerData) => {
    try {
      if (speakerData.id || speakerData._id) {
        // Edit existing
        setSpeakers((prev) =>
          prev.map((s) => ((s.id || s._id) === (speakerData.id || speakerData._id) ? speakerData : s))
        );
        if (profileDrawerSpeaker?.id === speakerData.id) {
          setProfileDrawerSpeaker(speakerData);
        }
        showToast('✓ Speaker profile updated successfully.');
      } else {
        // Add new
        const newSpeaker = {
          ...speakerData,
          id: `sp-${Date.now()}`,
          sessions: [],
          invitation: { sentAt: 'Just now', deliveryStatus: 'Accepted', openedAt: null }
        };
        setSpeakers((prev) => [newSpeaker, ...prev]);
        showToast(`Speaker "${newSpeaker.name}" added to event roster.`);
      }
    } catch (err) {
      showToast('Failed to save speaker.', 'error');
    }
  };

  // Handler for Invite Speaker
  const handleSendInvite = (inviteData) => {
    const newInvited = {
      ...inviteData,
      id: `sp-${Date.now()}`
    };
    setSpeakers((prev) => [newInvited, ...prev]);
    showToast('✓ Speaker invitation sent successfully.');
  };

  // Handler for Assign Session
  const handleConfirmAssign = (speakerId, { session, role }) => {
    setSpeakers((prev) =>
      prev.map((s) => {
        if ((s.id || s._id) === speakerId) {
          const currentSessions = s.sessions || [];
          const updated = [...currentSessions, { ...session, role }];
          const updatedSpeaker = { ...s, sessions: updated };
          if (profileDrawerSpeaker?.id === speakerId) {
            setProfileDrawerSpeaker(updatedSpeaker);
          }
          return updatedSpeaker;
        }
        return s;
      })
    );
    showToast(`Assigned ${assignSessionSpeaker?.name} to "${session.title}".`);
  };

  // Handler for Unassign Session
  const handleUnassignSession = (speakerId, sessionId) => {
    setSpeakers((prev) =>
      prev.map((s) => {
        if ((s.id || s._id) === speakerId) {
          const updatedSessions = (s.sessions || []).filter((ses) => (ses.id || ses._id) !== sessionId);
          const updated = { ...s, sessions: updatedSessions };
          if (profileDrawerSpeaker?.id === speakerId) {
            setProfileDrawerSpeaker(updated);
          }
          return updated;
        }
        return s;
      })
    );
    showToast('Speaker unassigned from session.');
  };

  // Handler for Resend Invite
  const handleConfirmResend = (speakerId, note) => {
    setSpeakers((prev) =>
      prev.map((s) => {
        if ((s.id || s._id) === speakerId) {
          const updated = {
            ...s,
            invitation: {
              ...s.invitation,
              lastResentAt: 'Just now',
              deliveryStatus: 'Delivered'
            }
          };
          if (profileDrawerSpeaker?.id === speakerId) setProfileDrawerSpeaker(updated);
          return updated;
        }
        return s;
      })
    );
    showToast(`Invitation reminder email resent to ${resendInviteSpeaker?.email || 'speaker'}.`);
  };

  // Handler for Safe Removal
  const handleConfirmRemove = (speakerId) => {
    const spToRemove = speakers.find((s) => (s.id || s._id) === speakerId);
    setSpeakers((prev) => prev.filter((s) => (s.id || s._id) !== speakerId));
    if (profileDrawerSpeaker?.id === speakerId) setProfileDrawerSpeaker(null);
    showToast(`Speaker "${spToRemove?.name || 'Speaker'}" removed from event.`);
  };

  // Handler for Unassign & Remove
  const handleUnassignAndRemove = (speakerId) => {
    const spToRemove = speakers.find((s) => (s.id || s._id) === speakerId);
    setSpeakers((prev) => prev.filter((s) => (s.id || s._id) !== speakerId));
    if (profileDrawerSpeaker?.id === speakerId) setProfileDrawerSpeaker(null);
    showToast(`Unassigned all sessions and removed "${spToRemove?.name || 'Speaker'}".`);
  };

  // Materials Review Handlers
  const handleApproveMaterial = (materialId) => {
    showToast('Presentation deck approved for projection.');
  };

  const handleRequestChangesMaterial = (materialId, feedback) => {
    showToast(`Change request sent to speaker: "${feedback.slice(0, 40)}..."`, 'warning');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Organization & Event Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Page Title & Scope */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="text-blue-600">Apex Global Events</span>
            <span>•</span>
            <span>Organizer Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Speakers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage speaker profiles, invitations, sessions and presentation materials.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-xs font-bold rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all"
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            <span>Invite Speaker</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Speaker</span>
          </button>
        </div>
      </div>

      {/* Active Event Selector Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/30 shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Active Event Roster
            </p>
            <h2 className="text-sm sm:text-base font-black text-white truncate mt-0.5">
              {selectedEvent}
            </h2>
          </div>
        </div>

        {/* Event Quick Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
            Switch Event:
          </span>
          <div className="relative">
            <select
              value={selectedEvent}
              onChange={(e) => {
                setSelectedEvent(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 pl-3.5 pr-8 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
            >
              {INITIAL_EVENTS.map((ev) => (
                <option key={ev.id} value={ev.title} className="bg-slate-900 text-white">
                  {ev.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 5 KPI Summary Cards */}
      <SpeakerSummaryCards
        stats={stats}
        activeFilter={statusFilter !== 'all' ? statusFilter : materialsFilter === 'pending' ? 'pending' : null}
        onFilterChange={handleSummaryCardFilter}
      />

      {/* Search & Multi-Filters Toolbar */}
      <SpeakerToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(s) => {
          setStatusFilter(s);
          setCurrentPage(1);
        }}
        eventFilter={eventFilter}
        onEventChange={(e) => {
          setEventFilter(e);
          setCurrentPage(1);
        }}
        sessionFilter={sessionFilter}
        onSessionChange={(ses) => {
          setSessionFilter(ses);
          setCurrentPage(1);
        }}
        materialsFilter={materialsFilter}
        onMaterialsChange={(m) => {
          setMaterialsFilter(m);
          setCurrentPage(1);
        }}
        availabilityFilter={availabilityFilter}
        onAvailabilityChange={(a) => {
          setAvailabilityFilter(a);
          setCurrentPage(1);
        }}
        onClearFilters={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={filteredSpeakers.length}
        events={INITIAL_EVENTS.filter((e) => e.id !== 'all')}
        sessions={allDistinctSessions}
      />

      {/* Speaker Display Area: Grid, List or Empty States */}
      {filteredSpeakers.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            type="no_results"
            onClearFilters={clearAllFilters}
          />
        ) : (
          <EmptyState
            type="empty"
            onAddSpeaker={handleOpenAdd}
            onInviteSpeaker={() => setIsInviteModalOpen(true)}
          />
        )
      ) : (
        <div className="space-y-5">
          {viewMode === 'grid' ? (
            <SpeakerGrid>
              {paginatedSpeakers.map((speaker) => (
                <SpeakerGrid.Card
                  key={speaker.id || speaker._id}
                  speaker={speaker}
                  onViewProfile={() => setProfileDrawerSpeaker(speaker)}
                  onEdit={() => handleOpenEdit(speaker)}
                  onAssignSession={() => setAssignSessionSpeaker(speaker)}
                  onResendInvite={() => setResendInviteSpeaker(speaker)}
                  onRemove={() => setRemoveSpeaker(speaker)}
                />
              ))}
            </SpeakerGrid>
          ) : (
            <SpeakerList
              speakers={paginatedSpeakers}
              onViewProfile={(speaker) => setProfileDrawerSpeaker(speaker)}
              onEdit={(speaker) => handleOpenEdit(speaker)}
              onAssignSession={(speaker) => setAssignSessionSpeaker(speaker)}
              onResendInvite={(speaker) => setResendInviteSpeaker(speaker)}
              onRemove={(speaker) => setRemoveSpeaker(speaker)}
            />
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredSpeakers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      {/* Slide-over Profile Drawer */}
      <SpeakerProfileDrawer
        isOpen={Boolean(profileDrawerSpeaker)}
        onClose={() => setProfileDrawerSpeaker(null)}
        speaker={profileDrawerSpeaker}
        onEdit={(speaker) => {
          setProfileDrawerSpeaker(null);
          handleOpenEdit(speaker);
        }}
        onAssignSession={(speaker) => {
          setAssignSessionSpeaker(speaker);
        }}
        onResendInvite={(speaker) => {
          setResendInviteSpeaker(speaker);
        }}
        onRemove={(speaker) => {
          setRemoveSpeaker(speaker);
        }}
        onUnassignSession={handleUnassignSession}
        onUploadMaterial={(doc) => showToast(`Uploaded material: ${doc.name}`)}
        onReviewMaterial={(id, action, feedback) => {
          if (action === 'approved') handleApproveMaterial(id);
          else handleRequestChangesMaterial(id, feedback);
        }}
      />

      {/* Add / Edit Speaker Modal */}
      <SpeakerFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveSpeaker}
        speaker={formModalSpeaker}
        activeEventName={selectedEvent}
        eventsList={INITIAL_EVENTS.filter((e) => e.id !== 'all')}
      />

      {/* Invite Speaker Modal */}
      <InviteSpeakerModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleSendInvite}
        activeEventName={selectedEvent}
      />

      {/* Assign Session Modal with Schedule Conflict Detector */}
      <AssignSessionModal
        isOpen={Boolean(assignSessionSpeaker)}
        onClose={() => setAssignSessionSpeaker(null)}
        speaker={assignSessionSpeaker}
        onAssign={handleConfirmAssign}
      />

      {/* Review Material Modal */}
      <MaterialReviewModal
        isOpen={Boolean(materialReviewData)}
        onClose={() => setMaterialReviewData(null)}
        material={materialReviewData}
        speakerName={profileDrawerSpeaker?.name || 'Speaker'}
        onApprove={handleApproveMaterial}
        onRequestChanges={handleRequestChangesMaterial}
      />

      {/* Remove Speaker Modal with Active Sessions Safeguard */}
      <RemoveSpeakerModal
        isOpen={Boolean(removeSpeaker)}
        onClose={() => setRemoveSpeaker(null)}
        speaker={removeSpeaker}
        onConfirmRemove={handleConfirmRemove}
        onUnassignAndRemove={handleUnassignAndRemove}
      />

      {/* Resend Invitation Reminder Modal */}
      <ResendInviteModal
        isOpen={Boolean(resendInviteSpeaker)}
        onClose={() => setResendInviteSpeaker(null)}
        speaker={resendInviteSpeaker}
        onConfirmResend={handleConfirmResend}
      />

      {/* Toast Notification Container */}
      <ToastNotification
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default Speakers;
