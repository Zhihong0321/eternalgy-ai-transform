import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, ShieldCheck, Sparkles, MessageSquare, Users, Award, Zap, Circle } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const CalendarView = () => {
    const { departmentPlans, t, loading } = useProject();
    const [currentDate] = useState(new Date(2026, 1, 8)); // Starting at Feb 2026
    const [selectedDaySignals, setSelectedDaySignals] = useState(null);

    // Calendar Helpers
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    // Map signals to days: { "02-08": { MEETING: 1, UPDATE: 2, ... } }
    const signalsSummaryByDay = useMemo(() => {
        const map = {};
        Object.entries(departmentPlans).forEach(([dept, logs]) => {
            logs.forEach(log => {
                // Handle various date formats (toLocaleString or ISO from backend)
                const date = new Date(log.timestamp);
                const mm = (date.getMonth() + 1).toString().padStart(2, '0');
                const dd = date.getDate().toString().padStart(2, '0');
                const dayKey = `${mm}-${dd}`;

                if (!map[dayKey]) map[dayKey] = { MEETING: 0, SYSTEM_UPDATE: 0, REQUEST: 0, FEEDBACK: 0, raw: [] };
                map[dayKey][log.type] = (map[dayKey][log.type] || 0) + 1;
                map[dayKey].raw.push({ ...log, dept });
            });
        });
        return map;
    }, [departmentPlans]);

    // Designer Report Aggregation
    const designerReport = useMemo(() => {
        const allUpdates = [];
        Object.entries(departmentPlans).forEach(([dept, logs]) => {
            logs.forEach(log => {
                if (log.type === 'SYSTEM_UPDATE') {
                    allUpdates.push({ ...log, dept });
                }
            });
        });
        return allUpdates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }, [departmentPlans]);

    const stats = useMemo(() => {
        const uniqueNodes = new Set(designerReport.map(u => u.dept));
        return {
            total: designerReport.length,
            coverage: uniqueNodes.size
        };
    }, [designerReport]);

    const getSignalMeta = (type) => {
        switch (type) {
            case 'MEETING': return { label: 'MEETING', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: <Users size={10} />, short: 'MTG' };
            case 'SYSTEM_UPDATE': return { label: 'UPDATE', color: 'text-eternalgy-cyan', bg: 'bg-eternalgy-cyan/10', border: 'border-eternalgy-cyan/20', icon: <ShieldCheck size={10} />, short: 'UPD' };
            case 'REQUEST': return { label: 'REQUEST', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: <Sparkles size={10} />, short: 'REQ' };
            case 'FEEDBACK': return { label: 'FEEDBACK', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: <MessageSquare size={10} />, short: 'FDB' };
            default: return { label: 'SIGNAL', color: 'text-white', bg: 'bg-white/10', border: 'border-white/20', icon: <Circle size={10} />, short: 'SIG' };
        }
    };

    const dayGrid = [];
    for (let i = 0; i < firstDayOfMonth; i++) dayGrid.push(null);
    for (let i = 1; i <= daysInMonth; i++) dayGrid.push(i);

    const handleDayClick = (day) => {
        if (!day) return;
        const mm = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const dd = day.toString().padStart(2, '0');
        const dayKey = `${mm}-${dd}`;
        const data = signalsSummaryByDay[dayKey] || { raw: [] };
        setSelectedDaySignals({ day, signals: data.raw, dayKey });
    };

    if (loading) return null; // Or a smaller loading state

    return (
        <div className="flex flex-col min-h-screen text-left pb-40">
            <header className="p-6 sticky top-0 bg-eternalgy-bg/80 backdrop-blur-xl z-20 border-b border-eternalgy-border/50">
                <h1 className="text-2xl font-bold font-outfit uppercase tracking-tight">{t('managementCalendar')}</h1>
                <p className="text-[10px] text-eternalgy-slate font-bold uppercase tracking-widest mt-1">{t('monthlyNeuralGrowth')}</p>
            </header>

            <section className="p-4">
                <div className="glass-card p-4 border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-sm font-outfit uppercase tracking-[0.2em]">{monthName} {year}</h3>
                        <div className="flex gap-2">
                            <button className="p-1.5 bg-white/5 rounded-lg text-eternalgy-slate cursor-not-allowed opacity-30"><ChevronLeft size={14} /></button>
                            <button className="p-1.5 bg-white/5 rounded-lg text-eternalgy-slate cursor-not-allowed opacity-30"><ChevronRight size={14} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5 mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={i} className="text-center text-[9px] font-bold text-eternalgy-slate uppercase opacity-50">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1.5">
                        {dayGrid.map((day, idx) => {
                            const mm = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                            const dd = day ? day.toString().padStart(2, '0') : null;
                            const dayKey = dd ? `${mm}-${dd}` : null;
                            const summary = dayKey ? signalsSummaryByDay[dayKey] : null;
                            const isToday = day === 8 && currentDate.getMonth() === 1;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleDayClick(day)}
                                    disabled={!day}
                                    className={`min-h-[90px] rounded-lg border flex flex-col items-start p-1.5 relative transition-all active:scale-95 ${!day ? 'bg-transparent border-transparent' : 'bg-white/[0.03] border-white/5 hover:border-eternalgy-cyan/30'} ${isToday ? 'border-eternalgy-cyan/50 bg-eternalgy-cyan/5' : ''}`}
                                >
                                    {day && (
                                        <>
                                            <span className={`text-[10px] font-bold font-outfit mb-1 ${isToday ? 'text-eternalgy-cyan' : 'text-eternalgy-slate'}`}>{day}</span>
                                            <div className="w-full space-y-1">
                                                {summary?.raw.slice(0, 3).map((log, sIdx) => {
                                                    const meta = getSignalMeta(log.type);
                                                    return (
                                                        <div key={sIdx} className={`flex items-center gap-1 px-1 py-0.5 rounded-[4px] border ${meta.bg} ${meta.color} ${meta.border} text-[6px] font-bold uppercase truncate`}>
                                                            {meta.icon} [{meta.short}]
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {(summary?.raw.length > 3) && (
                                                <span className="text-[6px] text-eternalgy-slate font-bold uppercase mt-auto self-end">+{summary.raw.length - 3}</span>
                                            )}
                                        </>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 px-2">
                    {['MEETING', 'SYSTEM_UPDATE', 'REQUEST', 'FEEDBACK'].map(type => {
                        const meta = getSignalMeta(type);
                        return (
                            <div key={type} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${meta.bg} ${meta.color} ${meta.border} text-[8px] font-bold uppercase`}>
                                {meta.icon} {meta.label}
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="px-6 mt-4">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-eternalgy-cyan/10 border border-eternalgy-cyan/20 flex items-center justify-center text-eternalgy-cyan">
                        <Award size={20} />
                    </div>
                    <h2 className="text-lg font-bold font-outfit uppercase tracking-tight">{t('itReport')}</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="glass-card p-4 border-eternalgy-cyan/10 bg-eternalgy-cyan/[0.02]">
                        <div className="flex items-center gap-2 text-eternalgy-cyan mb-2">
                            <Zap size={14} />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Deployments</span>
                        </div>
                        <div className="text-3xl font-bold font-outfit leading-none">{stats.total}</div>
                    </div>
                    <div className="glass-card p-4 border-white/5">
                        <div className="flex items-center gap-2 text-eternalgy-slate mb-2">
                            <Circle size={14} />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Coverage</span>
                        </div>
                        <div className="text-3xl font-bold font-outfit leading-none">{stats.coverage} / 9</div>
                    </div>
                </div>

                <div className="space-y-4">
                    {designerReport.map((update, idx) => (
                        <motion.div key={update.id} className="glass-card p-4 border-white/5 flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-2 h-2 rounded-full bg-eternalgy-cyan mt-1" />
                                <div className="w-[1px] flex-1 bg-white/5 my-2" />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] font-bold text-white uppercase">[{update.dept}] UPDATE</span>
                                    <span className="text-[9px] text-eternalgy-slate font-bold">{update.timestamp}</span>
                                </div>
                                <p className="text-xs text-gray-300">{update.content}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <AnimatePresence>
                {selectedDaySignals && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-end">
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="w-full bg-eternalgy-bg border-t border-white/10 rounded-t-[2rem] max-h-[85vh] overflow-hidden flex flex-col p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold font-outfit">{monthName} {selectedDaySignals.day}</h2>
                                <button onClick={() => setSelectedDaySignals(null)} className="p-2 bg-white/5 rounded-full"><Circle size={20} className="rotate-45" /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-4">
                                {selectedDaySignals.signals.map((s, i) => {
                                    const meta = getSignalMeta(s.type);
                                    return (
                                        <div key={i} className="flex gap-4 p-4 glass-card border-white/5">
                                            <div className={`p-2 h-fit rounded-lg ${meta.bg} ${meta.color}`}>{meta.icon}</div>
                                            <div className="flex-1">
                                                <p className="text-[9px] font-bold uppercase text-eternalgy-slate">{s.dept} • {meta.label}</p>
                                                <p className="text-sm text-gray-200 mt-1">{s.content}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CalendarView;

