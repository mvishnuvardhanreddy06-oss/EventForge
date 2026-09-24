import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'attendee',
    organizationName: '',
    interests: 'Artificial Intelligence, Cloud Computing, Web Development'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        organizationName: formData.role === 'organizer' ? formData.organizationName : undefined,
        interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean)
      };
      const user = await register(payload);
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'organizer':
          navigate('/organizer/dashboard');
          break;
        case 'staff':
          navigate('/staff/dashboard');
          break;
        case 'speaker':
          navigate('/speaker/dashboard');
          break;
        case 'sponsor':
          navigate('/sponsor/dashboard');
          break;
        case 'attendee':
        default:
          navigate('/attendee/dashboard');
          break;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <Link to="/" className="inline-flex items-center justify-center gap-2 mb-2 group">
          <i className="h-7 w-7 rounded-[7px_7px_7px_2px] bg-accent inline-block transition-transform group-hover:scale-105"></i>
          <span className="text-3xl font-display font-bold tracking-tight text-ink">
            EventForge
          </span>
        </Link>
        <p className="text-sm font-medium text-muted">
          Create your account to start planning or attending
        </p>
      </div>

      <div className="panel bg-surface border border-line text-ink p-7 sm:p-9 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display font-bold text-ink tracking-tight">Create Account</h2>
          <p className="text-xs text-muted mt-1 font-medium">Join modern corporate conferences &amp; summits</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center space-x-2 text-rose-500 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Jane Doe"
              className="field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Corporate Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="jane@company.com"
              className="field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Password (min 6 chars) *</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••••••"
              className="field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">I am registering as *</label>
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="field cursor-pointer text-sm font-medium"
            >
              <option value="attendee">Attendee (Discover &amp; Attend Events)</option>
              <option value="organizer">Event Organizer (Create &amp; Host Events)</option>
              <option value="speaker">Speaker (Present &amp; Deliver Sessions)</option>
              <option value="sponsor">Sponsor (Sponsor &amp; Manage Deliverables)</option>
            </select>
          </div>

          {formData.role === 'organizer' && (
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Organization / Agency Name *</label>
              <input
                type="text"
                required
                value={formData.organizationName}
                onChange={e => setFormData({ ...formData, organizationName: e.target.value })}
                placeholder="e.g. Apex Global Summits"
                className="field text-sm"
              />
            </div>
          )}

          {formData.role === 'attendee' && (
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Professional Interests (For AI Recommendations)</label>
              <input
                type="text"
                value={formData.interests}
                onChange={e => setFormData({ ...formData, interests: e.target.value })}
                placeholder="AI, Cloud, FinTech, Cybersecurity, DevOps"
                className="field text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-2.5 text-sm font-bold flex items-center justify-center space-x-2 mt-2"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-line text-center">
          <p className="text-xs text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
