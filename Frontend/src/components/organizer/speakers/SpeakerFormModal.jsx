import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Building,
  Briefcase,
  Mail,
  Phone,
  Globe,
  Linkedin,
  MapPin,
  Tag,
  Check
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop'
];

const SpeakerFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  speaker = null,
  activeEventName = 'Global Tech Leadership Summit 2026',
  eventsList = []
}) => {
  const isEdit = !!speaker;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImage: PRESET_AVATARS[0],
    designation: '',
    company: '',
    bio: '',
    linkedin: '',
    website: '',
    expertise: 'AI, Cloud, Leadership, FinTech',
    speakerType: 'Keynote',
    status: 'confirmed',
    availability: 'available',
    event: activeEventName
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (speaker) {
      const parts = (speaker.name || '').trim().split(' ');
      const fName = speaker.firstName || parts[0] || '';
      const lName = speaker.lastName || parts.slice(1).join(' ') || '';

      setFormData({
        firstName: fName,
        lastName: lName,
        email: speaker.email || '',
        phone: speaker.phone || '',
        profileImage: speaker.profileImage || speaker.avatar || PRESET_AVATARS[0],
        designation: speaker.designation || '',
        company: speaker.company || '',
        bio: speaker.bio || '',
        linkedin: speaker.linkedin || '',
        website: speaker.website || '',
        expertise: Array.isArray(speaker.expertise)
          ? speaker.expertise.join(', ')
          : Array.isArray(speaker.topics)
          ? speaker.topics.join(', ')
          : 'AI, Cloud, Leadership, FinTech',
        speakerType: speaker.speakerType || speaker.type || 'Keynote',
        status: speaker.status || 'confirmed',
        availability: speaker.availability || 'available',
        event: speaker.eventName || speaker.event || activeEventName
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        profileImage: PRESET_AVATARS[0],
        designation: '',
        company: '',
        bio: '',
        linkedin: '',
        website: '',
        expertise: 'AI, Cloud, Leadership, FinTech',
        speakerType: 'Keynote',
        status: 'confirmed',
        availability: 'available',
        event: activeEventName
      });
    }
    setErrors({});
  }, [speaker, isOpen, activeEventName]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const parsedExpertise = formData.expertise
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const payload = {
        ...speaker,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        profileImage: formData.profileImage,
        avatar: formData.profileImage,
        designation: formData.designation,
        company: formData.company,
        bio: formData.bio,
        linkedin: formData.linkedin,
        website: formData.website,
        expertise: parsedExpertise,
        topics: parsedExpertise,
        speakerType: formData.speakerType,
        type: formData.speakerType,
        status: formData.status,
        availability: formData.availability,
        eventName: formData.event,
        updatedAt: new Date().toISOString()
      };

      onSubmit(payload);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                {isEdit ? 'Edit Speaker Profile' : 'Add Speaker'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isEdit
                  ? 'Update speaker details, credentials and session assignment'
                  : 'Add a new speaker to your event speaker roster'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh] text-xs">
          {/* Profile Photo Selector */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Profile Photo
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-2xl bg-white border-2 border-blue-600 overflow-hidden shrink-0 shadow-xs">
                <img
                  src={formData.profileImage}
                  alt="Selected Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-600 mb-1.5">
                  Choose from presets or enter custom photo URL:
                </p>
                <div className="flex items-center space-x-2">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, profileImage: url })}
                      className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition-all ${
                        formData.profileImage === url
                          ? 'border-blue-600 scale-105 shadow-xs'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <input
                type="url"
                value={formData.profileImage}
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                placeholder="Or paste high-res image URL (https://...)"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
              />
            </div>
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Sarah"
                className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all ${
                  errors.firstName ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.firstName && <p className="text-[11px] text-rose-500 mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Wilson"
                className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all ${
                  errors.lastName ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.lastName && <p className="text-[11px] text-rose-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sarah@technova.com"
                className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all ${
                  errors.email ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
              />
            </div>
          </div>

          {/* Designation & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Designation <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Cloud Architect"
                className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all ${
                  errors.designation ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.designation && <p className="text-[11px] text-rose-500 mt-1">{errors.designation}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Company <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. TechNova"
                className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all ${
                  errors.company ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.company && <p className="text-[11px] text-rose-500 mt-1">{errors.company}</p>}
            </div>
          </div>

          {/* Speaker Type & Event */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Speaker Type
              </label>
              <select
                value={formData.speakerType}
                onChange={(e) => setFormData({ ...formData, speakerType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
              >
                <option value="Keynote">Keynote</option>
                <option value="Guest Speaker">Guest Speaker</option>
                <option value="Panelist">Panelist</option>
                <option value="Workshop Instructor">Workshop Instructor</option>
                <option value="Moderator">Moderator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Event Assignment
              </label>
              <select
                value={formData.event}
                onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
              >
                <option value="Global Tech Leadership Summit 2026">Global Tech Leadership Summit 2026</option>
                <option value="AI & Cloud Innovation Conference">AI & Cloud Innovation Conference</option>
                <option value="FinTech Future Forum">FinTech Future Forum</option>
              </select>
            </div>
          </div>

          {/* LinkedIn & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                LinkedIn / Professional Profile
              </label>
              <div className="relative">
                <Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Website
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Areas of Expertise / Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Areas of Expertise / Tags (e.g. AI, Cloud, Leadership, FinTech)
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={formData.expertise}
                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                placeholder="AI, Cloud, Leadership, FinTech"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bio <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Sarah is a cloud architecture specialist with experience designing enterprise-scale infrastructure..."
              className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all ${
                errors.bio ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.bio && <p className="text-[11px] text-rose-500 mt-1">{errors.bio}</p>}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEdit ? 'Save Changes' : 'Save Speaker'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpeakerFormModal;
