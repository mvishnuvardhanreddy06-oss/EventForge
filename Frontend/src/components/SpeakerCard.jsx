import React from 'react';
import { Twitter, Linkedin, Github, Globe } from 'lucide-react';

const SpeakerCard = ({ speaker, onEdit }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-blue-500/20">
            {speaker.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{speaker.name}</h4>
            <p className="text-xs text-blue-600 font-medium">{speaker.designation}</p>
            <p className="text-[11px] text-slate-400">{speaker.company}</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
          {speaker.bio || 'Distinguished industry speaker and subject matter expert.'}
        </p>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(speaker.expertise || []).map((exp, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
              {exp}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-400">
          {speaker.socialLinks?.twitter && (
            <a href={speaker.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-blue-500">
              <Twitter className="w-3.5 h-3.5" />
            </a>
          )}
          {speaker.socialLinks?.linkedin && (
            <a href={speaker.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-700">
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          )}
          {speaker.socialLinks?.github && (
            <a href={speaker.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-slate-900">
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {onEdit && (
          <button
            onClick={() => onEdit(speaker)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default SpeakerCard;
