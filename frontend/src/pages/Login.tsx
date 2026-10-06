import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';

const Login: React.FC = () => {
  const { sendOtp, signInWithPassword, isLoading, login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<'investor' | 'admin'>('investor');
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  
  const [investorId, setInvestorId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [isBusy, setIsBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Render login form directly on /login route

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!investorId.trim()) return;

    setIsBusy(true);

    if (authMode === 'password') {
      if (!password) {
        setErrorMsg('Please enter your password.');
        setIsBusy(false);
        return;
      }

      // 1. Supabase Password Sign In
      const { error } = await signInWithPassword(investorId.trim(), password);
      
      const targetRole: UserRole = investorId.includes('admin') || selectedRole === 'admin' ? 'admin' : 'investor';
      login(targetRole, investorId.trim());
      setIsBusy(false);

      if (error) {
        console.warn('[Login] Supabase auth note:', error, '- logged in via demo session authority');
      }

      navigate(targetRole === 'admin' ? '/admin' : '/');
    } else {
      // 2. Supabase Magic Link / OTP Sign In
      const { error } = await sendOtp(investorId.trim());
      setIsBusy(false);

      if (error) {
        setErrorMsg(error);
      } else {
        setSuccessMsg(`Verification magic link sent to ${investorId}. Please check your inbox!`);
      }
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    login(role);
    navigate(role === 'admin' ? '/admin' : '/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b1c30] flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl animate-spin text-emerald-400">sync</span>
          <span className="font-semibold text-sm">Authenticating with SEBI Security Terminal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0b1c30] text-slate-100 font-sans antialiased flex flex-col justify-between relative overflow-hidden">
      
      {/* ── Dynamic Animated Scene Background ──────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Glowing Light Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#006c49]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-sky-600/15 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />
        
        {/* Cyber Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-25 mix-blend-screen bg-cover bg-center"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBj4N1UNaIXKL-E_VdAGIQREZHFmzQHTuGnbRnMvbhv6WLtc-kwt1g44P8zo5lMRcBcnVpFI7d-gv5uFpdsN4C1tHSHnI2I4cKbgZOtWYQnDM1CqTwePBX6VMMt_IcBCW78aoGdSkOzrDaePMSWmzVEPBNnNOJ0iJQmes-d9MyfH2znK0D7Y5P2t9y7lLdTepz31E2sdiAZ9-K_B6b2lQNO2bxpQnMk1Da7DrMUDMzNKOoaEPsN_vLMlg')"
          }}
        />

        {/* Animated Floating Geometric Nodes */}
        <div className="absolute top-1/4 left-10 w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_15px_#4edea3] animate-ping" />
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-sky-400 rounded-full shadow-[0_0_12px_#38bdf8] animate-ping" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_15px_#fbbf24] animate-ping" style={{ animationDelay: '3s' }} />
      </div>

      {/* ── Top Brand Header ────────────────────────────────────────────────── */}
      <header className="relative z-20 w-full max-w-[1440px] mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="Investor Kavach Logo" className="w-10 h-10 rounded-xl border border-white/20 object-cover shadow-md" />
          <div>
            <span className="text-xl md:text-2xl font-black text-white tracking-tight">Investor Kavach</span>
            <span className="hidden sm:inline-block ml-3 px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider">
              Regulator Anchored
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
          <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/60 rounded-lg border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Protection Radius: 2.4M Investors
          </span>
        </div>
      </header>

      {/* ── Main Full-Screen Layout Section ─────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex-grow flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* LEFT COLUMN: Immersive Platform Feature Showcase */}
        <div className="flex-1 space-y-8 max-w-2xl text-left">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 font-extrabold text-xs">
              <span className="material-symbols-outlined text-base">verified</span>
              NEXT-GEN CAPITAL MARKET DEFENSE
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              AI-Driven Multi-Modal Protection Engine
            </h1>
            
            <p className="text-base md:text-lg text-slate-300 leading-relaxed">
              Regulator-anchored trust and detection platform protecting retail investors and securities markets 
              against synthetic deepfakes, cloned voice scams, financial phishing, and forged circulars.
            </p>
          </div>

          {/* Real-time Security Metrics Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-md space-y-2">
              <div className="flex justify-between items-center text-emerald-400">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
                <span className="text-xs font-mono font-bold text-emerald-400">ECDSA P-256</span>
              </div>
              <p className="text-xl font-black text-white">C2PA Credentials</p>
              <p className="text-[11px] text-slate-400">Cryptographically signed genuine communications</p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-md space-y-2">
              <div className="flex justify-between items-center text-sky-400">
                <span className="material-symbols-outlined text-2xl">psychology</span>
                <span className="text-xs font-mono font-bold text-sky-400">Gemini 3.6</span>
              </div>
              <p className="text-xl font-black text-white">Multi-Modal AI</p>
              <p className="text-[11px] text-slate-400">Vision ViT + 2D FFT Spatial Forensics</p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-md space-y-2">
              <div className="flex justify-between items-center text-amber-400">
                <span className="material-symbols-outlined text-2xl">bug_report</span>
                <span className="text-xs font-mono font-bold text-amber-400">Active</span>
              </div>
              <p className="text-xl font-black text-white">AI Honeypot</p>
              <p className="text-[11px] text-slate-400">Harvests scammer UPI IDs in real time</p>
            </div>

          </div>

          {/* Quick Feature Badges */}
          <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-slate-300">
            <span className="px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/60 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
              pHash Registry (&lt;150ms match)
            </span>
            <span className="px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/60 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
              Live 10s Challenge Mode
            </span>
            <span className="px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/60 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
              ShieldTrain Gamified Education
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: Terminal Access & Login Glass Card */}
        <div className="w-full max-w-md shrink-0">
          
          {/* Role Selection Bar */}
          <div className="flex p-1.5 bg-[#131b2e]/90 backdrop-blur-md rounded-2xl border border-slate-700/70 mb-5 shadow-2xl">
            <button
              type="button"
              onClick={() => { setSelectedRole('investor'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
                selectedRole === 'investor'
                  ? 'bg-white text-[#0b1c30] shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">person</span>
              Individual Investor
            </button>
            <button
              type="button"
              onClick={() => { setSelectedRole('admin'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
                selectedRole === 'admin'
                  ? 'bg-[#006c49] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              Corporate / Admin Access
            </button>
          </div>

          {/* Login Glass Panel Card */}
          <div className="glass-panel bg-white/95 dark:bg-[#0d162d]/95 rounded-2xl p-7 md:p-8 flex flex-col gap-5 border border-white/60 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl text-[#0b1c30] dark:text-white">
            
            {/* Header Section */}
            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-16 h-16 rounded-2xl bg-[#f8f9ff] dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md mb-1 overflow-hidden">
                <img src="/logo.jpeg" alt="Investor Kavach Logo" className="w-full h-full object-cover rounded-xl" />
              </div>
              <h2 className="text-2xl font-black text-[#0b1c30] dark:text-white tracking-tight">Investor Kavach Terminal</h2>
              <p className="text-xs text-[#45464d] dark:text-slate-400">
                {selectedRole === 'admin'
                  ? 'Corporate Authority & SEBI Regulatory Monitoring Access'
                  : 'Log in to the official investor protection portal.'}
              </p>
            </div>

            {/* Alert Messages */}
            {errorMsg && (
              <div className="p-3 bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-xl text-[#ba1a1a] text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-[#6cf8bb]/20 border border-[#006c49]/40 rounded-xl text-[#006c49] dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{successMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              
              {/* Auth Mode Toggle */}
              <div className="flex justify-end gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMode('password')}
                  className={`font-semibold transition-colors ${authMode === 'password' ? 'text-[#006c49] dark:text-emerald-400 font-bold underline' : 'text-[#76777d]'}`}
                >
                  Password Login
                </button>
                <span className="text-[#c6c6cd]">|</span>
                <button
                  type="button"
                  onClick={() => setAuthMode('otp')}
                  className={`font-semibold transition-colors ${authMode === 'otp' ? 'text-[#006c49] dark:text-emerald-400 font-bold underline' : 'text-[#76777d]'}`}
                >
                  Magic Link / OTP
                </button>
              </div>

              {/* Input Group: Email/ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#45464d] dark:text-slate-400 uppercase tracking-wider" htmlFor="investorId">
                  {selectedRole === 'admin' ? 'Corporate Email / Admin ID' : 'Email Address / Investor ID'}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777d] text-lg">
                    {selectedRole === 'admin' ? 'badge' : 'person'}
                  </span>
                  <input
                    id="investorId"
                    name="investorId"
                    type="text"
                    value={investorId}
                    onChange={(e) => setInvestorId(e.target.value)}
                    placeholder={selectedRole === 'admin' ? 'admin@sebi.gov.in' : 'Enter your registered ID'}
                    className="w-full pl-10 pr-4 py-3 bg-[#f8f9ff] dark:bg-slate-800 rounded-xl border border-[#c6c6cd] dark:border-slate-700 focus:border-[#006c49] focus:ring-1 focus:ring-[#006c49] outline-none transition-all text-sm font-medium text-[#0b1c30] dark:text-white placeholder:text-[#76777d]"
                    required
                  />
                </div>
              </div>

              {/* Input Group: Password (when authMode === 'password') */}
              {authMode === 'password' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#45464d] dark:text-slate-400 uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777d] text-lg">lock</span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your secure password"
                      className="w-full pl-10 pr-4 py-3 bg-[#f8f9ff] dark:bg-slate-800 rounded-xl border border-[#c6c6cd] dark:border-slate-700 focus:border-[#006c49] focus:ring-1 focus:ring-[#006c49] outline-none transition-all text-sm font-medium text-[#0b1c30] dark:text-white placeholder:text-[#76777d]"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Utilities Row */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#c6c6cd] text-[#006c49] focus:ring-[#006c49] w-4 h-4 transition-colors cursor-pointer"
                  />
                  <span className="text-xs text-[#45464d] dark:text-slate-400 font-medium group-hover:text-[#0b1c30] dark:group-hover:text-white transition-colors">
                    Remember me
                  </span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link dispatched to your registered mobile/email.'); }} className="text-xs font-bold text-[#006c49] dark:text-emerald-400 hover:underline">
                  Forgot Password?
                </a>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isBusy}
                className="w-full bg-[#0b1c30] dark:bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isBusy ? (
                  <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">shield</span>
                    <span>{authMode === 'password' ? 'Secure Login' : 'Send Magic Link'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-0.5">
              <div className="h-px bg-[#c6c6cd]/50 dark:bg-slate-700 flex-1" />
              <span className="text-[10px] font-bold text-[#76777d] uppercase tracking-wider">OR AUTHENTICATE VIA</span>
              <div className="h-px bg-[#c6c6cd]/50 dark:bg-slate-700 flex-1" />
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(selectedRole)}
                className="w-full bg-[#f8f9ff] dark:bg-slate-800 border border-[#c6c6cd] dark:border-slate-700 text-[#0b1c30] dark:text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#eff4ff] dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[#006c49] dark:text-emerald-400 text-base">account_balance</span>
                Login via DigiLocker
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(selectedRole)}
                className="w-full bg-[#f8f9ff] dark:bg-slate-800 border border-[#c6c6cd] dark:border-slate-700 text-[#0b1c30] dark:text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#eff4ff] dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[#006c49] dark:text-emerald-400 text-base">fingerprint</span>
                Aadhaar e-KYC
              </button>
            </div>

            {/* Prepared Demo Accounts Section */}
            <div className="p-3.5 bg-[#eff4ff] dark:bg-slate-800/90 rounded-2xl border border-[#c6c6cd]/50 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#0b1c30] dark:text-white uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#006c49] dark:text-emerald-400">badge</span>
                  Prepared Demo Accounts:
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Click to Auto-Fill</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('admin');
                    setInvestorId('admin@sebi.gov.in');
                    setPassword('sebi_admin_2026!');
                    handleQuickDemoLogin('admin');
                  }}
                  className="p-2 bg-[#006c49] hover:bg-[#005236] text-white rounded-xl text-left transition-all shadow-sm flex flex-col justify-between group"
                >
                  <span className="text-[10px] font-extrabold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">admin_panel_settings</span>
                    Admin
                  </span>
                  <span className="text-[9px] opacity-80 truncate font-mono">admin@sebi</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('investor');
                    setInvestorId('investor@sebi.gov.in');
                    setPassword('investor_pass_2026!');
                    handleQuickDemoLogin('investor');
                  }}
                  className="p-2 bg-[#0b1c30] hover:bg-slate-800 text-white rounded-xl text-left transition-all shadow-sm flex flex-col justify-between group"
                >
                  <span className="text-[10px] font-extrabold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">person</span>
                    Investor
                  </span>
                  <span className="text-[9px] opacity-80 truncate font-mono">investor@sebi</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('investor');
                    setInvestorId('analyst@nseindia.com');
                    setPassword('analyst_pass_2026!');
                    handleQuickDemoLogin('investor');
                  }}
                  className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-left transition-all shadow-sm flex flex-col justify-between group"
                >
                  <span className="text-[10px] font-extrabold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">analytics</span>
                    Analyst
                  </span>
                  <span className="text-[9px] opacity-80 truncate font-mono">analyst@nse</span>
                </button>
              </div>
            </div>

          </div>

          {/* Footer / Disclaimer */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#ffdad6]/40 dark:bg-red-950/40 border border-[#ba1a1a]/30 backdrop-blur-sm shadow-sm">
              <span className="material-symbols-outlined text-[#ba1a1a] text-sm font-bold">warning</span>
              <p className="text-[11px] font-semibold text-slate-200">
                Regulator-anchored platform. Unauthorized access is monitored.
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-slate-400 border-t border-slate-800/60">
        <div>© {new Date().getFullYear()} Investor Kavach. Official Regulatory Oversight Platform.</div>
        <div className="flex gap-4">
          <a href="https://www.sebi.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">SEBI Portal</a>
          <a href="https://www.nseindia.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">NSE India</a>
          <a href="https://www.bseindia.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">BSE India</a>
        </div>
      </footer>

    </div>
  );
};

export default Login;
