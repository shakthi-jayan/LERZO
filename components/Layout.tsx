
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserPlus, ClipboardList, FilePlus, 
  BookOpen, Tag, Clock, Download, Settings, CreditCard, Database,
  Menu, LogOut, ShieldCheck, ShieldOff
} from 'lucide-react';
import { APP_NAME, APP_SUBTITLE, SIDEBAR_ITEMS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const IconMap: Record<string, any> = {
  LayoutDashboard, Users, UserPlus, ClipboardList, FilePlus, 
  BookOpen, Tag, Clock, Download, Settings, CreditCard, Database
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
     if (localStorage.getItem('lerzo_bypass_auth') === 'true') {
        setIsDevMode(true);
     }
  }, []);

  const handleLogout = () => {
    // Simulate logging out
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('lerzo_bypass_auth');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white rounded flex items-center justify-center font-bold text-xs tracking-tighter">
                LERZO
              </div>
              <div>
                <h1 className="font-bold text-slate-900 leading-tight">{APP_NAME}</h1>
                <div className="flex items-center gap-1 text-xs text-blue-500 font-medium">
                   <span className="block w-2 h-2 bg-blue-500 rounded-full"></span>
                   {APP_SUBTITLE}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
            {SIDEBAR_ITEMS.map((item, index) => {
              if (item.section) {
                return (
                  <div key={index} className="px-3 pt-6 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {item.section}
                  </div>
                );
              }
              
              const Icon = IconMap[item.icon || 'LayoutDashboard'];
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={index}
                  to={item.path!}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100">
             {isDevMode && (
               <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800 flex items-center gap-2">
                  <ShieldOff className="w-3 h-3" />
                  <span className="font-bold">Developer Mode</span>
               </div>
             )}
             <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors">
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
             </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar (Mobile Only usually, but we can add global tools here) */}
        <header className="md:hidden bg-white border-b border-slate-200 flex items-center justify-between p-4">
           <div className="flex items-center gap-2">
             <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-500 hover:text-slate-700">
               <Menu className="h-6 w-6" />
             </button>
             <span className="font-bold text-slate-800">{APP_NAME}</span>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
