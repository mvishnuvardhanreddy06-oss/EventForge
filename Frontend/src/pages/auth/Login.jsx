import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowRight,
  Shield,
  ShieldCheck,
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  ClipboardCheck,
  Mic,
  Handshake,
  Ticket
} from 'lucide-react';

const Login = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('ATTENDEE');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      const actualRole = (user?.role || '').toUpperCase();
      const chosenRole = (selectedRole || '').toUpperCase();

      if (chosenRole && chosenRole !== actualRole) {
        logout();
        setError('Selected role does not match this account.');
        setLoading(false);
        return;
      }

      switch (actualRole) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'ORGANIZER':
          navigate('/organizer/dashboard');
          break;
        case 'STAFF':
          navigate('/staff/dashboard');
          break;
        case 'SPEAKER':
          navigate('/speaker/dashboard');
          break;
        case 'SPONSOR':
          navigate('/sponsor/dashboard');
          break;
        case 'ATTENDEE':
        default:
          navigate('/attendee/dashboard');
          break;
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setTestRole = (testEmail, roleKey) => {
    setEmail(testEmail);
    setPassword('Password123!');
    if (roleKey) {
      setSelectedRole(roleKey);
    }
    setError('');
  };

  return (
    <div className="w-full max-w-[460px] mx-auto flex flex-col items-center">
      {/* Top Brand */}
      <div className="text-center mb-6">
        <Link to="/" className="inline-flex items-center justify-center gap-2 mb-2 group">
          <i className="h-7 w-7 rounded-[7px_7px_7px_2px] bg-accent inline-block transition-transform group-hover:scale-105"></i>
          <span className="text-3xl font-display font-bold tracking-tight text-ink">
            EventForge
          </span>
        </Link>
        <p className="text-sm font-medium text-muted">
          All-in-one event management platform
        </p>
      </div>

      {/* Login Panel */}
      <div className="panel w-full bg-surface border border-line text-ink shadow-lg p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display font-bold text-ink tracking-tight">
            Welcome back
          </h2>
          <p className="text-xs text-muted mt-1 font-medium">
            Sign in to continue to your workspace
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2.5 text-rose-500 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
              Login role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="field cursor-pointer font-medium text-sm"
            >
              <option value="ADMIN">Platform Admin</option>
              <option value="ORGANIZER">Event Organizer</option>
              <option value="STAFF">Event Staff</option>
              <option value="SPEAKER">Speaker</option>
              <option value="SPONSOR">Sponsor</option>
              <option value="ATTENDEE">Attendee</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
              Corporate email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="field pl-9.5 text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-accent hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="field pl-9.5 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-2.5 text-sm font-bold mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign in to workspace'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-muted">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-semibold text-accent hover:underline">
            Create account
          </Link>
        </div>

        {/* Quick Demo Login Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-muted">
            <span className="bg-surface px-3">Quick Demo Login</span>
          </div>
        </div>

        {/* 6 Demo Role Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setTestRole('admin@eventforge.io', 'ADMIN')}
            className="px-2.5 py-2 rounded-xl bg-bg border border-line hover:border-accent text-ink font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            title="Autofill Platform Admin"
          >
            <Shield className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => setTestRole('organizer@apexevents.com', 'ORGANIZER')}
            className="px-2.5 py-2 rounded-xl bg-bg border border-line hover:border-accent text-ink font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            title="Autofill Event Organizer"
          >
            <Building2 className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>Organizer</span>
          </button>

          <button
            type="button"
            onClick={() => setTestRole('staff1@apexevents.com', 'STAFF')}
            className="px-2.5 py-2 rounded-xl bg-bg border border-line hover:border-accent text-ink font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            title="Autofill Event Staff"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-teal shrink-0" />
            <span>Staff</span>
          </button>

          <button
            type="button"
            onClick={() => setTestRole('speaker1@eventforge.io', 'SPEAKER')}
            className="px-2.5 py-2 rounded-xl bg-bg border border-line hover:border-accent text-ink font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            title="Autofill Keynote Speaker"
          >
            <Mic className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>Speaker</span>
          </button>

          <button
            type="button"
            onClick={() => setTestRole('sponsor1@eventforge.io', 'SPONSOR')}
            className="px-2.5 py-2 rounded-xl bg-bg border border-line hover:border-accent text-ink font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            title="Autofill Corporate Sponsor"
          >
            <Handshake className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>Sponsor</span>
          </button>

          <button
            type="button"
            onClick={() => setTestRole('attendee1@example.com', 'ATTENDEE')}
            className="px-2.5 py-2 rounded-xl bg-bg border border-line hover:border-accent text-ink font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            title="Autofill Conference Attendee"
          >
            <Ticket className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>Attendee</span>
          </button>
        </div>

        {/* Security Indicator */}
        <div className="mt-5 pt-4 border-t border-line text-center">
          <div className="inline-flex items-center justify-center space-x-1.5 text-xs font-semibold text-muted">
            <ShieldCheck className="w-4 h-4 text-teal shrink-0" />
            <span>Encrypted Corporate Workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
