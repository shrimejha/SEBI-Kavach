import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WebGLShaderBackground } from './WebGLShaderBackground';

const Layout = () => {
  const { userRole, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Dynamic Navigation Links matching user role
  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Scam Radar', path: '/radar' },
    { name: 'VerifyNet Hub', path: '/verifynet' },
    { name: 'ShieldTrain', path: '/training' },
    ...(userRole === 'admin' ? [{ name: 'Admin Console', path: '/admin' }] : []),
    { name: 'Account Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <div className="bg-[#f8f9ff] dark:bg-[#060b17] text-[#0b1c30] dark:text-[#f1f5f9] font-sans min-h-screen relative overflow-x-hidden antialiased flex flex-col justify-center">
        <WebGLShaderBackground />
        <main className="w-full flex-grow z-10 relative flex items-center justify-center">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9ff] dark:bg-[#060b17] text-[#0b1c30] dark:text-[#f1f5f9] font-sans min-h-screen relative overflow-x-hidden antialiased flex flex-col">
      {/* WebGL Shader Background */}
      <WebGLShaderBackground />

      {/* TopNavBar matching reference screenshots exactly */}
      <nav className="bg-white/80 dark:bg-[#131b2e]/80 backdrop-blur-md border-b border-[#e5eeff] dark:border-slate-800 shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 md:px-10 h-20 max-w-[1440px] mx-auto">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src="/logo.jpeg" alt="Investor Kavach Logo" className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
            <span className="text-xl md:text-2xl font-black text-[#0b1c30] dark:text-white tracking-tight">
              Investor Kavach
            </span>
          </Link>

          {/* Navigation Links (Exact 5 links matching reference screenshots) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-[#0b1c30] dark:text-white border-b-2 border-[#0b1c30] dark:border-sky-400 pb-1 font-bold'
                      : 'text-[#45464d] dark:text-slate-400 hover:text-[#0b1c30] dark:hover:text-white hover:bg-[#eff4ff] dark:hover:bg-slate-800/60 rounded-lg px-2 py-1'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 text-[#45464d] dark:text-slate-300 hover:text-[#0b1c30] hover:bg-[#eff4ff] dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              <span className="material-symbols-outlined" data-icon="dark_mode">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {userRole !== 'guest' ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#ba1a1a] dark:text-red-400 hover:bg-[#ffdad6]/40 dark:hover:bg-red-950/40 rounded-lg transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#0b1c30] dark:text-white hover:bg-[#eff4ff] rounded-lg transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Nav Links */}
        <div className="md:hidden flex items-center gap-3 overflow-x-auto no-scrollbar px-4 py-2 border-t border-[#e5eeff] dark:border-slate-800">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-semibold whitespace-nowrap px-3 py-1 rounded-lg ${
                  isActive
                    ? 'text-[#0b1c30] dark:text-white font-bold bg-[#dce9ff] dark:bg-slate-800'
                    : 'text-[#45464d] dark:text-slate-400'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1440px] w-full mx-auto px-4 md:px-10 py-8 flex-grow z-10 relative">
        <Outlet />
      </main>

      {/* Footer matching reference design */}
      <footer className="bg-white dark:bg-[#0d162d] text-[#45464d] dark:text-slate-400 border-t border-[#c6c6cd]/30 dark:border-slate-800 w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto z-10 relative text-xs">
        <div className="font-semibold text-[#0b1c30] dark:text-slate-200">
          © {new Date().getFullYear()} Investor Kavach. Official Regulatory Oversight Platform. Version 2.4.1-Shield.
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <a className="hover:text-[#0b1c30] dark:hover:text-white hover:underline transition-colors" href="https://www.sebi.gov.in" target="_blank" rel="noreferrer">SEBI Official</a>
          <a className="hover:text-[#0b1c30] dark:hover:text-white hover:underline transition-colors" href="https://www.nseindia.com" target="_blank" rel="noreferrer">NSE Portal</a>
          <a className="hover:text-[#0b1c30] dark:hover:text-white hover:underline transition-colors" href="https://www.bseindia.com" target="_blank" rel="noreferrer">BSE India</a>
          <a className="hover:text-[#0b1c30] dark:hover:text-white hover:underline transition-colors" href="#">Investor Grievance</a>
          <a className="hover:text-[#0b1c30] dark:hover:text-white hover:underline transition-colors" href="#">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
