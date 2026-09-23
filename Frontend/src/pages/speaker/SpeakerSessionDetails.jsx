import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { speakerPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import {
  Clock,
  Calendar,
  MapPin,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Upload,
  User,
  Building2,
  Mail,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Check
} from 'lucide-react';

const SpeakerSessionDetails = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchDetails();
  }, [sessionId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await speakerPortalService.getSessionDetails(sessionId);
      if (res.success && res.data) {
        setSessionData(res.data);
        if (res.data.session?.speakerConfirmationStatus === 'Confirmed') {
          setConfirmed(true);
        }
      }
    } catch (err) {
      console.error('Failed to load session details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAttendance = async () => {
    try {
      setConfirming(true);
      const res = await speakerPortalService.confirmSession(sessionId);
      if (res.success) {
        setConfirmed(true);
        setToastMessage('Attendance confirmed! AV production has been notified.');
        setTimeout(() => setToastMessage(''), 3500);
      }
    } catch (err) {
      alert(err.message || 'Failed to confirm attendance');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <Loader text="Loading session details..." />;
  if (!sessionData || !sessionData.session) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Session Not Found</h2>
        <p className="text-xs text-slate-500">The session you requested could not be found or you do not have permission to view it.</p>
        <Link to="/speaker/sessions" className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl inline-block">
          Return to My Sessions
        </Link>
      </div>
    );
  }

  const { session, speaker, coSpeakers = [] } = sessionData;
  const materials = session.materials || [];
  const latestMaterial = materials.length > 0 ? materials[materials.length - 1] : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* BACK NAVIGATION & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/speaker/sessions"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Sessions</span>
        </Link>

        <div className="flex items-center gap-2">
          {!confirmed ? (
            <button
              type="button"
              onClick={handleConfirmAttendance}
              disabled={confirming}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{confirming ? 'Confirming...' : 'Confirm Attendance'}</span>
            </button>
          ) : (
            <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 inline-flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Attendance Confirmed</span>
            </span>
          )}

          <Link
            to={`/speaker/materials?sessionId=${session._id}`}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center space-x-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Presentation</span>
          </Link>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SESSION HERO BANNER */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider border border-purple-200/60">
            {session.category || 'Keynote Presentation'}
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full capitalize">
            ● Status: {session.status || 'Scheduled'}
          </span>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60">
            ✓ Confirmed Participant
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
          {session.title}
        </h1>

        <p className="text-sm font-bold text-purple-700">
          {session.eventId?.title || 'Global Tech Leadership Summit 2026'}
        </p>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Date</p>
            <p className="font-bold text-slate-900 mt-1">
              {new Date(session.startTime).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Time Slot</p>
            <p className="font-bold text-slate-900 mt-1">
              {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Hall / Room</p>
            <p className="font-bold text-slate-900 mt-1">{session.roomName || 'Hall A'}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Capacity / RSVPs</p>
            <p className="font-bold text-slate-900 mt-1">
              {session.expectedAttendance || Math.round((session.capacity || 500) * 0.84)} / {session.capacity || 500}
            </p>
          </div>
        </div>
      </div>

      {/* 2-COLUMN DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2-COLS: DESCRIPTION, PRESENTATION & ORGANIZER NOTES */}
        <div className="lg:col-span-2 space-y-6">
          {/* DESCRIPTION */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Session Abstract & Syllabus
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
              {session.description || 'In this comprehensive keynote address, we examine modern enterprise architectures, autonomous tool calling, multi-agent evaluation frameworks, and scalable operational models powering enterprise technology transformations.'}
            </p>
          </div>

          {/* UPLOADED PRESENTATION */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Presentation Deck</span>
              </h3>
              <Link
                to={`/speaker/materials?sessionId=${session._id}`}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline"
              >
                {latestMaterial ? 'Replace Deck' : 'Upload Deck'}
              </Link>
            </div>

            {latestMaterial ? (
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/60 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {latestMaterial.fileType || 'PDF'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{latestMaterial.title}</p>
                    <p className="text-[11px] text-slate-500">
                      {latestMaterial.fileSize || '14.2 MB'} • Uploaded {new Date(latestMaterial.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {latestMaterial.status || 'Uploaded'}
                  </span>
                  <Link
                    to={`/speaker/materials?sessionId=${session._id}`}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-5 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50/50">
                <p className="text-xs font-bold text-slate-700">No Slide Deck Uploaded Yet</p>
                <p className="text-[11px] text-slate-500">
                  Upload your PDF or PPTX deck (up to 20MB) so AV technicians can verify aspect ratio and fonts.
                </p>
                <Link
                  to={`/speaker/materials?sessionId=${session._id}`}
                  className="px-3.5 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl inline-block"
                >
                  Upload Presentation Now
                </Link>
              </div>
            )}
          </div>

          {/* ORGANIZER NOTES */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Organizer Instructions & Technical Notes</span>
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 space-y-2 leading-relaxed">
              <p className="font-semibold text-slate-900">
                {session.organizerNotes || 'Please arrive at the session room 20-30 minutes prior to commencement.'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Wireless lavalier and handheld microphones will be fitted at the stage lectern.</li>
                <li>HDMI 4K presentation confidence monitors are positioned downstage.</li>
                <li>Presentation slides will run from the main stage switcher with remote clicker.</li>
                <li>Q&A moderators will pass audience microphones during the final 10 minutes.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SPEAKER INFO & CO-SPEAKERS */}
        <div className="space-y-6">
          {/* PRIMARY SPEAKER CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Assigned Speaker Profile
            </h3>

            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                {speaker?.name ? speaker.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'PS'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{speaker?.name || 'Dr. Priya Sharma'}</p>
                <p className="text-xs text-purple-700 font-semibold truncate">{speaker?.designation || 'VP of AI Research'}</p>
                <p className="text-[11px] text-slate-400 truncate">{speaker?.company || 'DeepNeural Labs'}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
              {speaker?.bio || 'Recognized innovator in autonomous agentic workflows, multi-modal reasoning models, and enterprise AI orchestration.'}
            </p>

            <Link
              to="/speaker/profile"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline block pt-2 border-t border-slate-100"
            >
              Edit Public Profile Information →
            </Link>
          </div>

          {/* EVENT CO-SPEAKERS / PANEL DIRECTORY */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Co-Speakers & Panelists
            </h3>

            {coSpeakers.length > 0 ? (
              <div className="space-y-2.5">
                {coSpeakers.map((cs) => (
                  <div key={cs._id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {cs.name ? cs.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'SP'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{cs.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{cs.designation || cs.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Solo keynote presentation.</p>
            )}
          </div>

          {/* CONTACT ORGANIZER HELP */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/70 p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Questions or Tech Changes?</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              If you require specialized stage props, audio feeds, or dual podium mics, notify the organizer team.
            </p>
            <a
              href="mailto:contact@apexevents.io?subject=Speaker Support Request"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-block"
            >
              Email Organizer Concierge →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerSessionDetails;
