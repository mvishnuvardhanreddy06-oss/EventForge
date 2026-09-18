import React, { useState } from 'react';
import { aiService } from '../services/api';
import AIContentBox from './AIContentBox';
import { Sparkles, FileText, User, Clock, Megaphone, Share2 } from 'lucide-react';

const AIGenerator = ({ onApplyContent = null }) => {
  const [activeTab, setActiveTab] = useState('event-description');
  const [loading, setLoading] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [history, setHistory] = useState([]);

  // Input States
  const [eventInputs, setEventInputs] = useState({
    title: 'FutureTech Global 2026',
    theme: 'AI & Enterprise Automation',
    audience: 'Corporate leaders, CTOs, and Architects',
    category: 'Artificial Intelligence',
    keyTopics: 'Autonomous Agents, Hyperscale Cloud, Security'
  });

  const [speakerInputs, setSpeakerInputs] = useState({
    name: 'Dr. Elena Rostova',
    designation: 'VP of AI Research',
    company: 'NeuralCorp',
    expertise: 'LLM Orchestration, Agentic Workflows',
    achievements: 'Author of landmark paper on autonomous multi-agent systems'
  });

  const [sessionInputs, setSessionInputs] = useState({
    title: 'Architecting Autonomous Multi-Agent Systems',
    category: 'Artificial Intelligence',
    speakerName: 'Dr. Elena Rostova',
    durationMinutes: 45,
    keyPoints: 'Tool calling loops, enterprise security boundaries, latency optimization'
  });

  const [announcementInputs, setAnnouncementInputs] = useState({
    eventTitle: 'Global AI Summit 2026',
    type: 'venue',
    details: 'Keynote hall moved to Grand Auditorium on 1st Floor due to capacity.',
    urgency: 'Urgent'
  });

  const [marketingInputs, setMarketingInputs] = useState({
    eventTitle: 'Global AI Summit 2026',
    date: 'October 15-17, 2026',
    venue: 'Silicon Convention Center',
    targetPlatform: 'LinkedIn & Twitter',
    perks: 'Keynotes from AI titans, VIP networking lounge, hands-on labs'
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      let payload = { type: activeTab };
      if (activeTab === 'event-description') payload = { ...payload, ...eventInputs };
      if (activeTab === 'speaker-bio') payload = { ...payload, ...speakerInputs };
      if (activeTab === 'session-summary') payload = { ...payload, ...sessionInputs };
      if (activeTab === 'announcement') payload = { ...payload, ...announcementInputs };
      if (activeTab === 'marketing-copy') payload = { ...payload, ...marketingInputs };

      const res = await aiService.generate(payload);
      if (res.success && res.data.generatedContent) {
        setGeneratedOutput(res.data.generatedContent);
        setHistory((prev) => [
          { type: activeTab, text: res.data.generatedContent, timestamp: new Date() },
          ...prev
        ]);
      }
    } catch (e) {
      alert('Generation error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'event-description', label: 'Event Description', icon: FileText },
    { id: 'speaker-bio', label: 'Speaker Bio', icon: User },
    { id: 'session-summary', label: 'Session Summary', icon: Clock },
    { id: 'announcement', label: 'Announcement', icon: Megaphone },
    { id: 'marketing-copy', label: 'Marketing Copy', icon: Share2 }
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setGeneratedOutput('');
              }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Generator Inputs</span>
          </h4>

          {activeTab === 'event-description' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  value={eventInputs.title}
                  onChange={e => setEventInputs({ ...eventInputs, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Core Theme</label>
                <input
                  type="text"
                  value={eventInputs.theme}
                  onChange={e => setEventInputs({ ...eventInputs, theme: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                <input
                  type="text"
                  value={eventInputs.audience}
                  onChange={e => setEventInputs({ ...eventInputs, audience: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Key Topics</label>
                <input
                  type="text"
                  value={eventInputs.keyTopics}
                  onChange={e => setEventInputs({ ...eventInputs, keyTopics: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'speaker-bio' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Speaker Name</label>
                <input
                  type="text"
                  value={speakerInputs.name}
                  onChange={e => setSpeakerInputs({ ...speakerInputs, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={speakerInputs.designation}
                    onChange={e => setSpeakerInputs({ ...speakerInputs, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={speakerInputs.company}
                    onChange={e => setSpeakerInputs({ ...speakerInputs, company: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expertise Areas</label>
                <input
                  type="text"
                  value={speakerInputs.expertise}
                  onChange={e => setSpeakerInputs({ ...speakerInputs, expertise: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'session-summary' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Session Title</label>
                <input
                  type="text"
                  value={sessionInputs.title}
                  onChange={e => setSessionInputs({ ...sessionInputs, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Speaker</label>
                  <input
                    type="text"
                    value={sessionInputs.speakerName}
                    onChange={e => setSessionInputs({ ...sessionInputs, speakerName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={sessionInputs.category}
                    onChange={e => setSessionInputs({ ...sessionInputs, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rough Key Points</label>
                <input
                  type="text"
                  value={sessionInputs.keyPoints}
                  onChange={e => setSessionInputs({ ...sessionInputs, keyPoints: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'announcement' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  value={announcementInputs.eventTitle}
                  onChange={e => setAnnouncementInputs({ ...announcementInputs, eventTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={announcementInputs.type}
                    onChange={e => setAnnouncementInputs({ ...announcementInputs, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="general">General</option>
                    <option value="urgent">Urgent</option>
                    <option value="session">Session</option>
                    <option value="venue">Venue</option>
                    <option value="registration">Registration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Urgency Level</label>
                  <select
                    value={announcementInputs.urgency}
                    onChange={e => setAnnouncementInputs({ ...announcementInputs, urgency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Details to Announce</label>
                <textarea
                  rows="3"
                  value={announcementInputs.details}
                  onChange={e => setAnnouncementInputs({ ...announcementInputs, details: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'marketing-copy' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  value={marketingInputs.eventTitle}
                  onChange={e => setMarketingInputs({ ...marketingInputs, eventTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Platform</label>
                  <input
                    type="text"
                    value={marketingInputs.targetPlatform}
                    onChange={e => setMarketingInputs({ ...marketingInputs, targetPlatform: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Venue / City</label>
                  <input
                    type="text"
                    value={marketingInputs.venue}
                    onChange={e => setMarketingInputs({ ...marketingInputs, venue: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attendee Perks & Incentives</label>
                <input
                  type="text"
                  value={marketingInputs.perks}
                  onChange={e => setMarketingInputs({ ...marketingInputs, perks: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Drafting with AI...' : 'Generate Professional Draft'}</span>
          </button>
        </div>

        {/* Preview Container */}
        <div>
          <AIContentBox
            content={generatedOutput}
            loading={loading}
            onRegenerate={handleGenerate}
            onUseContent={onApplyContent}
          />
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
