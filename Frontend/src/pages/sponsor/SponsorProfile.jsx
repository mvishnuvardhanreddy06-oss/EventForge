import React, { useState, useEffect } from 'react';
import { sponsorPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  User,
  MapPin,
  Save,
  Eye,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Linkedin,
  Twitter,
  Github,
  Youtube,
  FileText
} from 'lucide-react';

const SponsorProfile = () => {
  const [profile, setProfile] = useState({
    companyName: '',
    website: '',
    logo: '',
    industry: '',
    description: '',
    shortBio: '',
    contactPerson: '',
    contactTitle: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      youtube: ''
    },
    brandAssets: {
      primaryLogoUrl: '',
      darkLogoUrl: '',
      guidelinesUrl: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await sponsorPortalService.getProfile();
        if (res.data?.success && res.data.data.sponsor) {
          const sp = res.data.data.sponsor;
          setProfile({
            companyName: sp.companyName || '',
            website: sp.website || '',
            logo: sp.logo || '',
            industry: sp.industry || '',
            description: sp.description || '',
            shortBio: sp.shortBio || '',
            contactPerson: sp.contactPerson || '',
            contactTitle: sp.contactTitle || '',
            email: sp.email || '',
            phone: sp.phone || '',
            address: {
              street: sp.address?.street || '',
              city: sp.address?.city || '',
              state: sp.address?.state || '',
              country: sp.address?.country || '',
              postalCode: sp.address?.postalCode || ''
            },
            socialLinks: {
              linkedin: sp.socialLinks?.linkedin || '',
              twitter: sp.socialLinks?.twitter || '',
              github: sp.socialLinks?.github || '',
              youtube: sp.socialLinks?.youtube || ''
            },
            brandAssets: {
              primaryLogoUrl: sp.brandAssets?.primaryLogoUrl || sp.logo || '',
              darkLogoUrl: sp.brandAssets?.darkLogoUrl || '',
              guidelinesUrl: sp.brandAssets?.guidelinesUrl || ''
            }
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Compute profile completion score
  const calculateCompletion = () => {
    const fields = [
      profile.companyName,
      profile.website,
      profile.logo || profile.brandAssets.primaryLogoUrl,
      profile.description,
      profile.contactPerson,
      profile.email,
      profile.phone,
      profile.address.city,
      profile.socialLinks.linkedin || profile.socialLinks.twitter
    ];
    const filled = fields.filter(f => f && f.trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await sponsorPortalService.updateProfile(profile);
      if (res.data?.success) {
        setMessage({ type: 'success', text: 'Corporate sponsor profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: res.data?.message || 'Failed to update profile.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Error updating profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading your corporate profile..." />;

  const completionPct = calculateCompletion();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Corporate Sponsor Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain your official organization branding, contact representative, corporate biography, and public profile presence.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-all self-start sm:self-auto"
        >
          <Eye className="w-4 h-4 text-blue-600" />
          <span>Preview Public Profile</span>
        </button>
      </div>

      {/* Profile Completion Meter */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Profile Completeness</span>
          <span className="font-bold text-blue-600">{completionPct}% Complete</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400">
          A fully completed corporate profile ensures optimal brand visibility on event landing pages and exhibitor directories.
        </p>
      </div>

      {/* Notifications banner */}
      {message.text && (
        <div className={`p-4 rounded-2xl text-xs flex items-center space-x-2.5 ${
          message.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Organization & Identity */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Organization & Brand Identity</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Company Name *</label>
              <input
                type="text"
                required
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Official Website URL *</label>
              <input
                type="url"
                required
                placeholder="https://company.com"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Industry / Domain</label>
              <input
                type="text"
                placeholder="e.g. Cloud Infrastructure, AI & Machine Learning, FinTech"
                value={profile.industry}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Logo Image URL</label>
              <input
                type="url"
                placeholder="https://company.com/assets/logo.png"
                value={profile.logo}
                onChange={(e) => setProfile({ ...profile, logo: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Representative */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <User className="w-4 h-4 text-purple-600" />
            <span>Designated Corporate Representative</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Primary Contact Name *</label>
              <input
                type="text"
                required
                value={profile.contactPerson}
                onChange={(e) => setProfile({ ...profile, contactPerson: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Contact Title / Designation</label>
              <input
                type="text"
                placeholder="e.g. Director of Strategic Partnerships"
                value={profile.contactTitle}
                onChange={(e) => setProfile({ ...profile, contactTitle: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Contact Email *</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Direct Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Bios & Story */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Corporate Biography & Tagline</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Tagline / Short Pitch (One-liner)</label>
              <input
                type="text"
                placeholder="Empowering enterprise engineering teams with next-gen scalable compute."
                value={profile.shortBio}
                onChange={(e) => setProfile({ ...profile, shortBio: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Corporate Overview</label>
              <textarea
                rows={4}
                placeholder="Provide an overview of your organization's products, services, developer tooling, and mission for the official conference program..."
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Headquarters Address */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Headquarters Address</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-2 space-y-1">
              <label className="font-bold text-slate-700">Street Address</label>
              <input
                type="text"
                placeholder="1600 Amphitheatre Parkway"
                value={profile.address.street}
                onChange={(e) => setProfile({
                  ...profile,
                  address: { ...profile.address, street: e.target.value }
                })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">City</label>
              <input
                type="text"
                placeholder="Mountain View"
                value={profile.address.city}
                onChange={(e) => setProfile({
                  ...profile,
                  address: { ...profile.address, city: e.target.value }
                })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">State / Province</label>
              <input
                type="text"
                placeholder="California"
                value={profile.address.state}
                onChange={(e) => setProfile({
                  ...profile,
                  address: { ...profile.address, state: e.target.value }
                })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Country</label>
              <input
                type="text"
                placeholder="United States"
                value={profile.address.country}
                onChange={(e) => setProfile({
                  ...profile,
                  address: { ...profile.address, country: e.target.value }
                })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Postal Code</label>
              <input
                type="text"
                placeholder="94043"
                value={profile.address.postalCode}
                onChange={(e) => setProfile({
                  ...profile,
                  address: { ...profile.address, postalCode: e.target.value }
                })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Social Channels */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Social & Developer Channels</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center space-x-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-700" />
                <span>LinkedIn Page</span>
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/company/yourcompany"
                value={profile.socialLinks.linkedin}
                onChange={(e) => setProfile({
                  ...profile,
                  socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
                })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center space-x-1.5">
                <Twitter className="w-3.5 h-3.5 text-sky-500" />
                <span>Twitter / X Profile</span>
              </label>
              <input
                type="url"
                placeholder="https://x.com/yourcompany"
                value={profile.socialLinks.twitter}
                onChange={(e) => setProfile({
                  ...profile,
                  socialLinks: { ...profile.socialLinks, twitter: e.target.value }
                })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center space-x-1.5">
                <Github className="w-3.5 h-3.5 text-slate-800" />
                <span>GitHub Organization</span>
              </label>
              <input
                type="url"
                placeholder="https://github.com/yourcompany"
                value={profile.socialLinks.github}
                onChange={(e) => setProfile({
                  ...profile,
                  socialLinks: { ...profile.socialLinks, github: e.target.value }
                })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center space-x-1.5">
                <Youtube className="w-3.5 h-3.5 text-rose-600" />
                <span>YouTube Channel</span>
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/@yourcompany"
                value={profile.socialLinks.youtube}
                onChange={(e) => setProfile({
                  ...profile,
                  socialLinks: { ...profile.socialLinks, youtube: e.target.value }
                })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* Profile Preview Modal */}
      {showPreview && (
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Public Sponsor Preview"
        >
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl space-y-3">
              <div className="flex items-center space-x-3">
                {profile.logo ? (
                  <img src={profile.logo} alt="Logo" className="w-12 h-12 rounded-xl object-contain bg-white p-1" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base">
                    {profile.companyName ? profile.companyName.slice(0, 2).toUpperCase() : 'SP'}
                  </div>
                )}
                <div>
                  <h4 className="text-base font-bold">{profile.companyName || 'Corporate Partner'}</h4>
                  <p className="text-xs text-amber-300">{profile.industry || 'Technology Partner'}</p>
                </div>
              </div>

              {profile.shortBio && (
                <p className="text-xs text-slate-300 italic">"{profile.shortBio}"</p>
              )}

              {profile.description && (
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{profile.description}</p>
              )}

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center space-x-1">
                    <span>Visit Official Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <span className="text-[11px] text-slate-400">
                  {profile.address.city ? `${profile.address.city}, ${profile.address.country}` : 'Global Partner'}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SponsorProfile;
