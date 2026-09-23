import React, { useState, useEffect } from 'react';
import { speakerPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Award,
  BookOpen,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  Save,
  Sparkles,
  ExternalLink,
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';

const SESSION_TYPE_OPTIONS = [
  'Keynote',
  'Workshop',
  'Panel Discussion',
  'Breakout Session',
  'Lightning Talk',
  'Fireside Chat / Q&A'
];

const SpeakerProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [industry, setIndustry] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [expertise, setExpertise] = useState([]);
  const [preferredSessionTypes, setPreferredSessionTypes] = useState([]);
  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    twitter: '',
    github: '',
    website: ''
  });
  const [completionScore, setCompletionScore] = useState(0);

  // Topic input state
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await speakerPortalService.getProfile();
      if (res.success && res.data?.speaker) {
        const s = res.data.speaker;
        setName(s.name || '');
        setDesignation(s.designation || '');
        setCompany(s.company || '');
        setEmail(s.email || '');
        setPhone(s.phone || '');
        setLocation(s.location || '');
        setCountry(s.country || 'India');
        setYearsExperience(s.yearsExperience ? String(s.yearsExperience) : '');
        setIndustry(s.industry || '');
        setShortBio(s.shortBio || '');
        setBio(s.bio || '');
        setProfileImage(s.profileImage || '');
        setExpertise(Array.isArray(s.expertise) ? s.expertise : []);
        setPreferredSessionTypes(Array.isArray(s.preferredSessionTypes) ? s.preferredSessionTypes : ['Keynote', 'Panel Discussion']);
        setSocialLinks({
          linkedin: s.socialLinks?.linkedin || '',
          twitter: s.socialLinks?.twitter || '',
          github: s.socialLinks?.github || '',
          website: s.socialLinks?.website || ''
        });
        setCompletionScore(s.completion || 0);
      }
    } catch (err) {
      console.error('Failed to load speaker profile:', err);
      setErrorMessage('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = (e) => {
    e?.preventDefault();
    const trimmed = newTopic.trim();
    if (!trimmed) return;
    if (!expertise.includes(trimmed)) {
      setExpertise([...expertise, trimmed]);
    }
    setNewTopic('');
  };

  const handleRemoveTopic = (topicToRemove) => {
    setExpertise(expertise.filter(t => t !== topicToRemove));
  };

  const handleToggleSessionType = (type) => {
    if (preferredSessionTypes.includes(type)) {
      setPreferredSessionTypes(preferredSessionTypes.filter(t => t !== type));
    } else {
      setPreferredSessionTypes([...preferredSessionTypes, type]);
    }
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    try {
      setSaving(true);
      setErrorMessage('');
      setSuccessToast('');

      const payload = {
        name,
        designation,
        company,
        phone,
        location,
        country,
        yearsExperience: yearsExperience ? parseInt(yearsExperience, 10) : undefined,
        industry,
        shortBio,
        bio,
        profileImage,
        expertise,
        preferredSessionTypes,
        socialLinks
      };

      const res = await speakerPortalService.updateProfile(payload);
      if (res.success) {
        setSuccessToast('Speaker profile updated successfully! Changes are live on your session materials.');
        if (res.data?.speaker?.completion !== undefined) {
          setCompletionScore(res.data.speaker.completion);
        }
        setTimeout(() => setSuccessToast(''), 4500);
      } else {
        setErrorMessage(res.message || 'Failed to save changes.');
      }
    } catch (err) {
      console.error('Save profile error:', err);
      setErrorMessage(err.response?.data?.message || 'Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  // Missing fields calculation for completion guidance
  const missingItems = [];
  if (!shortBio) missingItems.push({ label: 'Short Bio for session badges', weight: '+10%' });
  if (!bio) missingItems.push({ label: 'Full biography', weight: '+10%' });
  if (!phone) missingItems.push({ label: 'Direct contact phone number', weight: '+10%' });
  if (!location) missingItems.push({ label: 'Location / City', weight: '+10%' });
  if (expertise.length === 0) missingItems.push({ label: 'Speaking topics & tags', weight: '+10%' });
  if (!socialLinks.linkedin && !socialLinks.twitter) missingItems.push({ label: 'LinkedIn or Twitter profile', weight: '+10%' });
  if (!profileImage) missingItems.push({ label: 'Profile avatar URL', weight: '+10%' });

  const getInitials = (n) => {
    if (!n) return 'SP';
    return n.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading Speaker Profile..." />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Speaker Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage your public speaker persona, speaking credentials, and attendee-facing bio.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors inline-flex items-center space-x-1.5"
          >
            <Eye className="w-4 h-4 text-purple-600" />
            <span>Preview Public Card</span>
          </button>
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </div>

      {/* TOASTS */}
      {successToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* PROFILE COMPLETION METER */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-radial from-purple-500/20 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-purple-500/30 text-purple-200 text-[10px] font-black rounded uppercase tracking-wider border border-purple-400/30">
                Profile Strength
              </span>
              <span className="text-xs text-purple-200 font-medium">
                {completionScore >= 80 ? '🌟 Highly Complete & Verified' : 'Complete recommended fields to maximize organizer invitations'}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Profile Readiness: {completionScore}%
            </h2>
            <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${completionScore}%` }}
              />
            </div>
          </div>

          {missingItems.length > 0 ? (
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 text-xs shrink-0 max-w-xs space-y-1">
              <p className="font-bold text-purple-200 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Next steps to reach 100%:</span>
              </p>
              <ul className="text-[11px] text-slate-200 space-y-1">
                {missingItems.slice(0, 2).map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-2">
                    <span className="truncate">• {item.label}</span>
                    <span className="text-emerald-300 font-bold shrink-0">{item.weight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-3 text-xs shrink-0 flex items-center space-x-2 text-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="font-bold">All Fields Completed!</p>
                <p className="text-[11px] text-emerald-300">Your speaker profile is at peak visibility.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: AVATAR & BASIC DETAILS (1 col) */}
        <div className="space-y-6">
          {/* AVATAR CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Speaker Photo & Avatar
            </h3>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-purple-100 shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-sm border-4 border-purple-100">
                    {getInitials(name)}
                  </div>
                )}
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" title="Verified Speaker" />
              </div>

              <div className="w-full text-left space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Photo Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
                <p className="text-[11px] text-slate-400">
                  Recommended: Square JPG or PNG, minimum 400x400px.
                </p>
              </div>
            </div>
          </div>

          {/* SOCIAL & PORTFOLIO LINKS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Public Links</span>
              <Globe className="w-4 h-4 text-purple-600" />
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                  <span>LinkedIn URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Twitter className="w-3.5 h-3.5 text-sky-500" />
                  <span>X / Twitter Handle or URL</span>
                </label>
                <input
                  type="text"
                  placeholder="@handle or https://x.com/username"
                  value={socialLinks.twitter}
                  onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-800" />
                  <span>GitHub Profile</span>
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={socialLinks.github}
                  onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Website / Portfolio</span>
                </label>
                <input
                  type="url"
                  placeholder="https://drpriyasharma.ai"
                  value={socialLinks.website}
                  onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PROFESSIONAL INFO, BIOGRAPHY & TOPICS (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* PERSONAL & PROFESSIONAL INFO */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Professional Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Professional Title / Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VP of AI Research, Principal Architect"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Company / Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DeepNeural Labs"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address (Account)</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-xl px-3.5 py-2.5 text-xs cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone Number (Direct)</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Location / City</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Years of Industry Experience</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  placeholder="14"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Industry / Domain</label>
                <input
                  type="text"
                  placeholder="e.g. Artificial Intelligence & Enterprise Cloud"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>
            </div>
          </div>

          {/* BIOGRAPHY SECTION */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Speaker Biographies
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Short Bio / One-liner *</label>
                  <span className="text-[10px] text-slate-400">
                    {shortBio.length} / 160 characters (ideal for session badges)
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={240}
                  placeholder="VP of AI Research at DeepNeural Labs, specializing in LLM systems, neural architectures, and distributed ML pipelines."
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 resize-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Full Professional Biography *</label>
                  <span className="text-[10px] text-slate-400">
                    {bio.length} characters (shown on event speaker profile page)
                  </span>
                </div>
                <textarea
                  rows={5}
                  placeholder="Dr. Priya Sharma is an internationally recognized researcher and technology executive leading applied AI breakthroughs at DeepNeural Labs. Over the past 14 years, she has authored 20+ peer-reviewed papers on neural architectures and helped deploy production ML infrastructure servicing over 100M daily active requests..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>
            </div>
          </div>

          {/* EXPERTISE TOPICS & SESSION PREFERENCES */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Speaking Topics & Format Preferences
            </h3>

            {/* TOPICS / EXPERTISE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Topics of Expertise (Tags)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {expertise.map((topic, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200/60 rounded-full text-xs font-bold"
                  >
                    <span>{topic}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(topic)}
                      className="w-3.5 h-3.5 rounded-full hover:bg-purple-200/60 inline-flex items-center justify-center text-purple-700"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add a topic (e.g. Generative AI, Edge Computing)..."
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTopic();
                    }
                  }}
                  className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tag</span>
                </button>
              </div>
            </div>

            {/* PREFERRED SESSION TYPES */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700">
                Preferred Session Formats
              </label>
              <div className="flex flex-wrap gap-2">
                {SESSION_TYPE_OPTIONS.map((type) => {
                  const isSelected = preferredSessionTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleToggleSessionType(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors inline-flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SAVE BUTTON FOOTER */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              Preview Public Profile
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* PREVIEW MODAL */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Public Speaker Preview (Attendee & Schedule View)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* CARD VIEW */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-purple-200 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
                    {getInitials(name)}
                  </div>
                )}
                <div className="text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-xl font-black text-slate-900">{name || 'Speaker Name'}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200">
                      Featured Speaker
                    </span>
                  </div>
                  <p className="text-xs font-bold text-purple-700">
                    {designation || 'VP of Research'} {company ? `• ${company}` : ''}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{location || 'Bengaluru, India'}</span>
                    {industry && <span>• {industry}</span>}
                  </p>
                </div>
              </div>

              {shortBio && (
                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-purple-900 font-medium italic">
                  "{shortBio}"
                </div>
              )}

              {bio && (
                <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                  <p className="font-bold text-slate-900">About the Speaker:</p>
                  <p className="whitespace-pre-line">{bio}</p>
                </div>
              )}

              {expertise.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Expertise & Topics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {expertise.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SOCIAL LINKS */}
              {(socialLinks.linkedin || socialLinks.twitter || socialLinks.github || socialLinks.website) && (
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-200/60">
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter.startsWith('http') ? socialLinks.twitter : `https://x.com/${socialLinks.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white border border-slate-200 text-sky-500 hover:bg-sky-50 transition-colors"
                      title="X / Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.github && (
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.website && (
                    <a
                      href={socialLinks.website}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Personal Website"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakerProfile;
