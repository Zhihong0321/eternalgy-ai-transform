import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Languages, Search, Bell, Menu, LayoutGrid, MessageSquare, Calendar, User, ShieldCheck, LogOut, LayoutList, ChevronRight } from 'lucide-react';
import Home from './components/Home';
import DepartmentDetail from './components/DepartmentDetail';
import NeuralHub from './components/NeuralHub';
import EventsHub from './components/EventsHub';
import CalendarView from './components/CalendarView';
import AdminDashboard from './components/AdminDashboard';
import { useProject } from './context/ProjectContext';

const App = () => {
  const [view, setView] = React.useState({ type: 'home', data: null });
  const [activeTab, setActiveTab] = useState('home');
  const [showAdmin, setShowAdmin] = useState(false);
  const { theme, toggleTheme, lang, setLang, t, user, mockUsers, setUser } = useProject();

  const isAnyAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

  const renderContent = () => {
    if (showAdmin) {
      return <AdminDashboard onBack={() => setShowAdmin(false)} />;
    }

    if (view.type === 'detail') {
      return <DepartmentDetail dept={view.data} onBack={() => setView({ type: 'home', data: null })} />;
    }

    switch (activeTab) {
      case 'home': return <Home onSelectDept={(dept) => setView({ type: 'detail', data: dept })} />;
      case 'events': return <EventsHub />;
      case 'calendar': return <CalendarView />;
      case 'neural': return <NeuralHub />;
      case 'profile': return (
        <div className="min-h-screen flex flex-col p-8 pt-12 text-left">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-eternalgy-cyan/20 to-blue-500/20 border border-eternalgy-cyan/30 flex items-center justify-center text-eternalgy-cyan overflow-hidden shadow-2xl">
              <img src={user.avatar} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold font-outfit">{user.name}</h1>
              <p className="text-[10px] text-eternalgy-slate font-bold uppercase tracking-[0.2em] mt-1">{user.role.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="space-y-4">
            {isAnyAdmin && (
              <button
                onClick={() => setShowAdmin(true)}
                className="w-full glass-card p-6 flex items-center justify-between border-eternalgy-cyan/20 bg-eternalgy-cyan/5 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-eternalgy-cyan rounded-xl text-black group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg uppercase tracking-tight">Control Center</h3>
                    <p className="text-[10px] text-eternalgy-slate font-bold uppercase">System & Node Management</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-eternalgy-cyan" />
              </button>
            )}

            <div className="glass-card p-6 border-white/5 opacity-50">
              <h3 className="font-bold text-sm uppercase tracking-tight">Account Details</h3>
              <p className="text-[10px] text-eternalgy-slate mt-1 italic">Synchronization active...</p>
            </div>

            {/* DEMO: Switch User */}
            <div className="pt-12">
              <p className="text-[10px] text-eternalgy-slate font-bold uppercase tracking-widest mb-4">Demo: Switch Profile</p>
              <div className="flex gap-2">
                {mockUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => setUser(u)}
                    className={`px-3 py-2 rounded-lg text-[9px] font-bold border transition-all ${user.id === u.id ? 'border-eternalgy-cyan bg-eternalgy-cyan/10 text-eternalgy-cyan' : 'border-white/10 text-eternalgy-slate'}`}
                  >
                    {u.role.split('_')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
      default: return <Home onSelectDept={(dept) => setView({ type: 'detail', data: dept })} />;
    }
  };

  return (
    <div className={`max-w-md mx-auto min-h-screen bg-eternalgy-bg relative flex flex-col shadow-2xl overflow-x-hidden ${theme}`}>
      {/* Universal Sticky Header */}
      <header className="px-6 py-3 flex justify-between items-center border-b border-eternalgy-border/50 sticky top-0 bg-eternalgy-bg/60 backdrop-blur-xl z-[100]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-eternalgy-cyan to-blue-600 flex items-center justify-center font-bold text-black text-[10px]">
            E
          </div>
          <span className="font-outfit font-bold tracking-tight text-current uppercase text-[10px] sm:text-xs">
            {t('appName')}
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <button onClick={toggleTheme} className="p-1.5 text-eternalgy-slate hover:text-eternalgy-cyan transition-colors">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setLang(lang === 'en' ? 'cn' : 'en')} className="p-1.5 text-eternalgy-slate hover:text-eternalgy-cyan transition-colors flex items-center gap-1">
            <Languages size={16} />
            <span className="text-[9px] font-bold uppercase">{lang}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={(showAdmin ? 'admin' : view.type) + (view.data?.id || '') + activeTab + lang + user.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* APP-WIDE FLOATING BOTTOM NAV BAR */}
      {!showAdmin && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[98%] max-w-[400px] z-50">
          <div className="glass-card bg-eternalgy-bg/80 backdrop-blur-2xl border-white/10 px-4 py-2 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <NavIcon
              active={activeTab === 'home' && !showAdmin}
              onClick={() => { setActiveTab('home'); setView({ type: 'home', data: null }); }}
              icon={<LayoutGrid size={20} />}
              label={t('activeNodes').split(' ')[0]} // "Nodes"
            />
            <NavIcon
              active={activeTab === 'events'}
              onClick={() => { setActiveTab('events'); setView({ type: 'home', data: null }); }}
              icon={<LayoutList size={20} />}
              label={t('roadmap').split(' ')[0]} // "Roadmap"
            />
            <NavIcon
              active={activeTab === 'calendar'}
              onClick={() => { setActiveTab('calendar'); setView({ type: 'home', data: null }); }}
              icon={<Calendar size={20} />}
              label={t('managementCalendar').split(' ')[1]} // "Progress" (Management Progress)
            />
            <NavIcon
              active={activeTab === 'neural'}
              onClick={() => { setActiveTab('neural'); setView({ type: 'home', data: null }); }}
              icon={<MessageSquare size={20} />}
              label={t('neuralHub').split(' ')[1]} // "Forum" / "Hub"
            />
            <NavIcon
              active={activeTab === 'profile' || showAdmin}
              onClick={() => { setActiveTab('profile'); setView({ type: 'home', data: null }); setShowAdmin(false); }}
              icon={<User size={20} />}
              label="Profile"
            />
          </div>
        </nav>
      )}

      {/* Decorative Footer */}
      {(view.type === 'home' && activeTab === 'home' && !showAdmin) && (
        <footer className="p-8 pt-0 bg-eternalgy-bg/80 flex justify-center pb-32">
          <p className="text-[9px] text-eternalgy-slate font-bold uppercase tracking-[0.3em] text-center opacity-50">
            {t('roadmap')}
          </p>
        </footer>
      )}
    </div>
  );
};

const NavIcon = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center flex-1 py-2 transition-all duration-300 ${active ? 'text-eternalgy-cyan' : 'text-eternalgy-slate hover:text-gray-400'}`}
  >
    {active && (
      <motion.div
        layoutId="nav-bg"
        className="absolute inset-x-1 inset-y-0 bg-eternalgy-cyan/10 rounded-xl"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <div className="relative z-10 flex flex-col items-center gap-1">
      {icon}
      <span className="text-[7px] font-bold uppercase tracking-tighter leading-none">{label}</span>
      {active && <motion.div layoutId="nav-dot" className="w-1 h-1 bg-eternalgy-cyan rounded-full mt-0.5" />}
    </div>
  </button>
);

export default App;
