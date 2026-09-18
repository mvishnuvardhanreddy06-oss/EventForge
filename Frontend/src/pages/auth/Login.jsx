import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Layers,
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
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
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
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setTestRole = (testEmail) => {
    setEmail(testEmail);
    setPassword('Password123!');
    setError('');
  };

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col items-center">
      {/* TOP BRANDING */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 mb-3 transition-transform hover:scale-105">
          <Layers className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          EventForge
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Enterprise Event Management Platform
        </p>
      </div>

      {/* CENTERED LOGIN CARD */}
      <div className="w-full bg-white rounded-[22px] border border-slate-200/80 shadow-xl shadow-slate-200/50 p-7 sm:p-9 transition-all">
        {/* LOGIN HEADER */}
        <div className="text-center mb-7">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Sign in to your EventForge account
          </p>
        </div>

        {/* ERROR ALERT BOX */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5 text-rose-700 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Corporate Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Corporate Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your corporate email"
                className="w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember / Forgot on single row */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-600">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => alert('Password reset instructions have been dispatched to your corporate administrator or registered email.')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Register link */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 hover:underline">
              Register now
            </Link>
          </p>
        </div>

        {/* Quick Demo Login Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <span className="bg-white px-3">Quick Demo Login</span>
          </div>
        </div>

        {/* 6 Demo Role Buttons: 2 columns on mobile, 3 columns on tablet/desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <button
            type="button"
            onClick={() => setTestRole('mvishnuvardhanreddy33@gmail.com')}
            className="px-2.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 text-slate-700 font-semibold border border-slate-200/80 flex items-center justify-center space-x-1.5 transition-all group"
            title="Autofill Platform Admin"
          >
            <Shield className="w-3.5 h-3.5 text-slate-600 group-hover:scale-110 transition-transform shrink-0" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => setTestRole('organizer@nexus.io')}
            className="px-2.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 text-slate-700 font-semibold border border-slate-200/80 flex items-center justify-center space-x-1.5 transition-all group"
            title="Autofill Event Organizer"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform shrink-0" />
            <span>Organizer</span>
          </button>

          <button
            type="button"
            onClick={() => setTestRole('staff1@eventforge.io')}
            className="px-2.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 text-slate-700 font-semibold border border-slate-200/80 flex items-center justify-center space-x-1.5 transition-all group"
            title="Autofill Event Staff"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
            <span>Staff</span>
          </button>

          <button
            type="button"
            onClick={() => setTestRole('speaker1@eventforge.io')}
            className="px-2.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 text-slate-700 font-semibold border border-slate-200/80 flex items-center justify-center space-x-1.5 transition-all group"
            title="Autofill Keynote Speaker"
          >
            <Mic className="w-3.5 h-3.5 text-purple-600 group-hover:scale-110 transition-transform shrink-0" />
            <span>Speaker</span>
          </button>

          <button
            type="button"
            onClick={() => setTestRole('sponsor1@eventforge.io')}
            className="px-2.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 text-slate-700 font-semibold border border-slate-200/80 flex items-center justify-center space-x-1.5 transition-all group"
            title="Autofill Corporate Sponsor"
          >
            <Handshake className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform shrink-0" />
            <span>Sponsor</span>
          </button>

          <button
            type="button"
            onClick={() => setTestRole('attendee1@example.com')}
            className="px-2.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 text-slate-700 font-semibold border border-slate-200/80 flex items-center justify-center space-x-1.5 transition-all group"
            title="Autofill Conference Attendee"
          >
            <Ticket className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform shrink-0" />
            <span>Attendee</span>
          </button>
        </div>

        {/* Security Indicator */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <div className="inline-flex items-center justify-center space-x-1.5 text-xs font-semibold text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Secure Enterprise Access</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            256-bit Encryption • Role-Based Access
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
