import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, TrendingUp, Users, Settings, Sparkles, Calendar, Clock, EyeOff } from 'lucide-react';
import Timeline from './Timeline';
import { useProject } from '../context/ProjectContext';

const Home = ({ onSelectDept }) => {
    const { departmentPlans, allDepts, t } = useProject();

    const getIcon = (name) => {
        switch (name) {
            case 'SALES': return <TrendingUp size={14} />;
            case 'ADMIN': case 'HR': case 'CS': return <Users size={14} />;
            case 'O&M': case 'ENGINEERING': case 'IT': return <Settings size={14} />;
            default: return <LayoutGrid size={14} />;
        }
    };

    // Only show visible departments
    const visibleDepts = allDepts.filter(d => d.visible !== false);

    return (
        <div className="flex flex-col">
            {/* Page 2: Status Grid Section */}
            <section className="p-6">
                <header className="mb-6 text-left">
                    <h2 className="text-sm font-bold tracking-[0.2em] text-eternalgy-slate uppercase mb-1">{t('systemTopology')}</h2>
                    <h1 className="text-2xl font-bold font-outfit">{t('activeNodes')}</h1>
                </header>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    {visibleDepts.map((dept) => (
                        <motion.div
                            layout
                            key={dept.name}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectDept(dept)}
                            className="glass-card p-5 h-36 flex flex-col justify-between cursor-pointer border-white/5 hover:border-eternalgy-cyan/30 transition-all shadow-lg hover:shadow-eternalgy-cyan/5 text-left"
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold text-eternalgy-slate uppercase flex items-center gap-1.5">
                                    {getIcon(dept.name)} {dept.name}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-eternalgy-slate opacity-40">{dept.version}</span>
                                    {departmentPlans[dept.name]?.length > 0 && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-eternalgy-cyan shadow-[0_0_8px_#00F2FF]" />
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-eternalgy-cyan mb-1">
                                    <Clock size={14} />
                                    <span className="text-lg font-bold font-outfit tracking-tight leading-tight">
                                        {dept.lastUpdate}
                                    </span>
                                </div>
                                <span className="text-[9px] text-eternalgy-slate uppercase font-bold tracking-[0.15em]">{t('lastUpdateLabel')}</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Page 2: Upcoming Event Section */}
            <section className="bg-eternalgy-bg/40 backdrop-blur-md border-t border-eternalgy-border mt-4">
                <header className="p-6 pb-0 text-left">
                    <h2 className="text-sm font-bold tracking-[0.2em] text-eternalgy-slate uppercase mb-1">{t('upcomingMilestone')}</h2>
                </header>
                <Timeline />
            </section>
        </div>
    );
};

export default Home;
