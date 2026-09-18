import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MoreVertical,
  Edit,
  Copy,
  Eye,
  CheckCircle,
  Users,
  Archive,
  Trash2,
  BarChart3,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

const EventActionsMenu = ({
  event,
  onDuplicate,
  onArchive,
  onDeleteDraft,
  onPublish
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const isDraft = (event.status || '').toLowerCase() === 'draft';
  const isCompleted = (event.status || '').toLowerCase() === 'completed';

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-2xs hover:text-slate-900"
        title="More Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100 divide-y divide-slate-100">
          <div className="py-1">
            {/* Edit Event */}
            <Link
              to={`/organizer/events/${event.id || event._id}/edit`}
              className="w-full flex items-center space-x-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 font-semibold transition-colors text-left"
              onClick={() => setIsOpen(false)}
            >
              <Edit className="w-3.5 h-3.5 text-slate-400" />
              <span>{isDraft ? 'Edit Draft' : 'Edit Event'}</span>
            </Link>

            {/* View / Preview */}
            <Link
              to={`/organizer/events/${event.id || event._id}`}
              className="w-full flex items-center space-x-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 font-semibold transition-colors text-left"
              onClick={() => setIsOpen(false)}
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{isDraft ? 'Preview' : 'View Event'}</span>
            </Link>
          </div>

          <div className="py-1">
            {/* Publish (for Draft) */}
            {isDraft ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onPublish(event);
                }}
                className="w-full flex items-center space-x-2 px-3.5 py-1.5 text-blue-600 hover:bg-blue-50 font-bold transition-colors text-left"
              >
                <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Publish Event</span>
              </button>
            ) : (
              <>
                {/* Manage Registrations */}
                <Link
                  to={`/organizer/events/${event.id || event._id}/registrations`}
                  className="w-full flex items-center space-x-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 font-semibold transition-colors text-left"
                  onClick={() => setIsOpen(false)}
                >
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Manage Registrations</span>
                </Link>

                {/* View Analytics */}
                <Link
                  to={`/organizer/events/${event.id || event._id}/analytics`}
                  className="w-full flex items-center space-x-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 font-semibold transition-colors text-left"
                  onClick={() => setIsOpen(false)}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Analytics</span>
                </Link>
              </>
            )}

            {/* Duplicate Event */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onDuplicate(event);
              }}
              className="w-full flex items-center space-x-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 font-semibold transition-colors text-left"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Duplicate Event</span>
            </button>
          </div>

          <div className="py-1">
            {isDraft ? (
              /* Delete Draft (Only for Drafts) */
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onDeleteDraft(event);
                }}
                className="w-full flex items-center space-x-2 px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 font-bold transition-colors text-left"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Delete Draft</span>
              </button>
            ) : (
              /* Archive Event (For Published/Completed) */
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onArchive(event);
                }}
                className="w-full flex items-center space-x-2 px-3.5 py-1.5 text-amber-700 hover:bg-amber-50 font-semibold transition-colors text-left"
              >
                <Archive className="w-3.5 h-3.5 text-amber-600" />
                <span>Archive Event</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventActionsMenu;
