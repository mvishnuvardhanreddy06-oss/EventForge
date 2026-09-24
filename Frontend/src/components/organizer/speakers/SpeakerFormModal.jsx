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
  Check,
  Search,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const KNOWN_REAL_PHOTOS = [
  { match: /virat|kholi|kohli/i, name: 'Virat Kohli', url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Virat_Kohli_portrait.jpg' },
  { match: /sundar|pichai/i, name: 'Sundar Pichai', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Sundar_pichai.png' },
  { match: /satya|nadella/i, name: 'Satya Nadella', url: 'https://upload.wikimedia.org/wikipedia/commons/7/78/MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg' },
  { match: /sam.*altman/i, name: 'Sam Altman', url: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Sam_Altman_TechCrunch_Disrupt_2019_%28cropped%29.jpg' },
  { match: /jensen|huang/i, name: 'Jensen Huang', url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Jensen_Huang_at_Computex_2024.jpg' },
  { match: /elon.*musk/i, name: 'Elon Musk', url: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop1%29.jpg' },
  { match: /dhoni/i, name: 'MS Dhoni', url: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Mahendra_Singh_Dhoni_in_January_2023.jpg' },
  { match: /rohit.*sharma/i, name: 'Rohit Sharma', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Rohit_Sharma_portrait.jpg' },
  { match: /sachin/i, name: 'Sachin Tendulkar', url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Sachin_Tendulkar_at_MRF_Promotion_Event.jpg' }
];

const PRESET_AVATARS = [
  {
    name: 'Virat Kohli',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Virat_Kohli_portrait.jpg'
  },
  {
    name: 'Sundar Pichai',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Sundar_pichai.png'
  },
  {
    name: 'Satya Nadella',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/78/MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg'
  },
  {
    name: 'Sam Altman',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Sam_Altman_TechCrunch_Disrupt_2019_%28cropped%29.jpg'
  },
  {
    name: 'Jensen Huang',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Jensen_Huang_at_Computex_2024.jpg'
  },
  {
    name: 'Dr. Priya Sharma',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop'
  }
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
    profileImage: PRESET_AVATARS[0].url,
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
      const fullName = `${fName} ${lName}`.trim();

      const matched = KNOWN_REAL_PHOTOS.find((p) => p.match.test(fullName));
      let initialImg = speaker.profileImage || speaker.avatar;
      if (matched && (!initialImg || initialImg.includes('unsplash.com/photo-1500648767791') || initialImg.includes('unsplash.com/photo-1534528741775'))) {
        initialImg = matched.url;
      } else if (!initialImg) {
        initialImg = PRESET_AVATARS[0].url;
      }

      setFormData({
        firstName: fName,
        lastName: lName,
        email: speaker.email || '',
        phone: speaker.phone || '',
        profileImage: initialImg,
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
        profileImage: PRESET_AVATARS[0].url,
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

  const handleNameChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    const fullName = `${field === 'firstName' ? value : formData.firstName} ${field === 'lastName' ? value : formData.lastName}`.trim();
    const matched = KNOWN_REAL_PHOTOS.find((p) => p.match.test(fullName));
    if (matched && (!updated.profileImage || updated.profileImage.includes('unsplash.com/photo-1500648767791') || updated.profileImage.includes('unsplash.com/photo-1534528741775') || updated.profileImage === PRESET_AVATARS[0].url)) {
      updated.profileImage = matched.url;
    }
    setFormData(updated);
  };

  const currentFullName = `${formData.firstName} ${formData.lastName}`.trim();
  const matchedRealPhoto = KNOWN_REAL_PHOTOS.find((p) => p.match.test(currentFullName));

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
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Profile Photo (Real Images & Google URLs)
              </label>
              <a
                href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${formData.firstName} ${formData.lastName}`.trim() || 'keynote speaker portrait')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                title="Search on Google Images in new tab"
              >
                <Search className="w-3 h-3" />
                <span>Search Google Images</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-2xl bg-white border-2 border-blue-600 overflow-hidden shrink-0 shadow-xs">
                <img
                  src={formData.profileImage}
                  alt="Selected Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PRESET_AVATARS[0].url;
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-600 mb-1.5">
                  Choose from real verified presets or enter photo URL:
                </p>
                <div className="flex items-center space-x-2">
                  {PRESET_AVATARS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      title={item.name}
                      onClick={() => setFormData({ ...formData, profileImage: item.url })}
                      className={`relative w-8 h-8 rounded-xl overflow-hidden border-2 transition-all ${
                        formData.profileImage === item.url
                          ? 'border-blue-600 scale-105 shadow-xs ring-2 ring-blue-500/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Smart Real Photo Matcher (e.g. Virat Kohli, etc.) */}
            {matchedRealPhoto && (
              <div className="p-2.5 bg-blue-50 border border-blue-200/90 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={matchedRealPhoto.url}
                    alt={matchedRealPhoto.name}
                    className="w-8 h-8 rounded-lg object-cover border border-blue-300 shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-[11px] font-bold text-blue-950">
                      Real photo available for {matchedRealPhoto.name}
                    </p>
                    <p className="text-[10px] text-blue-700">Official verified image from Google / Wikipedia</p>
                  </div>
                </div>
                {formData.profileImage !== matchedRealPhoto.url ? (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, profileImage: matchedRealPhoto.url })}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Use Real Photo</span>
                  </button>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center space-x-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Real Photo Active</span>
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center space-x-2 pt-1">
              <div className="flex-1">
                <input
                  type="url"
                  value={formData.profileImage}
                  onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  placeholder="Paste real image URL from Google (https://...)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
                />
              </div>
              <a
                href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${formData.firstName} ${formData.lastName}`.trim() || 'keynote speaker portrait')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-xl text-[11px] font-bold transition-all shadow-2xs shrink-0"
                title="Search on Google Images in new tab"
              >
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span>Search Google</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
            <p className="text-[10px] text-slate-400">
              Supports any image address copied from Google Images, Wikipedia, or web links.
            </p>
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
                onChange={(e) => handleNameChange('firstName', e.target.value)}
                placeholder="e.g. Virat"
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
                onChange={(e) => handleNameChange('lastName', e.target.value)}
                placeholder="e.g. Kohli"
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
