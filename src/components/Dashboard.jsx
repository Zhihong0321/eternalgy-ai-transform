import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, TrendingUp, Users, Settings, X, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import PlanningForm from './PlanningForm';
import { useProject } from '../context/ProjectContext';

const getDeptIcon = (name) => {
    const n = name.toUpperCase();
    if (n.includes('SALES')) return <TrendingUp size={14} />;
    if (n.includes('ENGINEERING') || n.includes('O&M') || n.includes('IT')) return <Settings size={14} />;
    if (n.includes('FINANCE') || n.includes('PROJECT')) return <LayoutGrid size={14} />;
    if (n.includes('SEDA') || n.includes('C&I') || n.includes('CULTURE')) return <Sparkles size={14} />;
    return <Users size={14} />;
};

const getDeptColor = (name) => {
    const n = name.toUpperCase();
    if (n.includes('SEDA') || n.includes('C&I') || n.includes('EFFICIENCY')) return '#FF00E5';
    return '#00F2FF';
};

const Dashboard = () => {
    const [selectedDept, setSelectedDept] = useState(null);
    const [isPlanning, setIsPlanning] = useState(false);
    const { departmentPlans, allDepts, loading } = useProject();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen opacity-50">
                <Loader2 className="animate-spin text-eternalgy-cyan mb-4" size={40} />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-eternalgy-slate">Synchronizing System Data...</p>
            </div>
        );
    }

    return (
        <div className="p-6 pb-24">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                    Department Overview
                </h1>
                <p className="text-eternalgy-slate text-sm mt-1">Status by Department • 2026 Plan</p>
            </header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-4"
            >
                {allDepts.map((dept) => {
                    const icon = getDeptIcon(dept.name);
                    const color = getDeptColor(dept.name);
                    const status = dept.percent ? `${Math.round(dept.percent)}%` : '0%';

                    return (
                        <motion.div
                            key={dept.id}
                            variants={item}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedDept({ ...dept, icon, color, status })}
                            className="glass-card p-4 flex flex-col justify-between h-32 relative overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"
                                style={{ backgroundColor: color }}
                            />

                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold tracking-widest text-eternalgy-slate uppercase flex items-center gap-1">
                                    {icon} {dept.name}
                                </span>
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                            </div>

                            <div className="mt-auto">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-2xl font-bold font-outfit">{status}</span>
                                    {departmentPlans[dept.name]?.length > 0 && (
                                        <span className="text-[10px] text-eternalgy-cyan bg-eternalgy-cyan/10 px-2 py-0.5 rounded-full mb-1">
                                            {departmentPlans[dept.name].length} REQ
                                        </span>
                                    )}
                                </div>
                                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: status }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: color }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedDept && !isPlanning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card w-full max-w-md p-6 relative"
                        >
                            <button onClick={() => setSelectedDept(null)} className="absolute top-4 right-4 p-2 glass-card rounded-full border-0">
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-eternalgy-cyan/10 flex items-center justify-center text-eternalgy-cyan">
                                    {selectedDept.icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold font-outfit">{selectedDept.name}</h2>
                                    <p className="text-sm text-eternalgy-slate">Digitalisation Roadmap</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2">
                                <h3 className="text-xs font-bold tracking-widest text-eternalgy-slate uppercase">Active Signals</h3>
                                {departmentPlans[selectedDept.name]?.length > 0 ? (
                                    departmentPlans[selectedDept.name].map((plan, i) => (
                                        <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5">
                                            <p className="text-sm text-gray-200">{plan.content}</p>
                                            <p className="text-[10px] text-eternalgy-slate mt-2 italic">
                                                Logged on {plan.timestamp}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
                                        <p className="text-xs text-eternalgy-slate">No signals found for this department.</p>
                                    </div>
                                )}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsPlanning(true)}
                                className="w-full py-4 bg-eternalgy-cyan text-black font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-eternalgy-cyan/20"
                            >
                                <ChevronRight size={18} />
                                START PIC PLANNING
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isPlanning && (
                    <PlanningForm
                        department={selectedDept.name}
                        onClose={() => {
                            setIsPlanning(false);
                            setSelectedDept(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;

