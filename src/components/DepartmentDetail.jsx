import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, BadgeCheck, Send, Info, Calendar, MessageCircle, Cpu, ClipboardList, MessageSquare, Sparkles, ShieldCheck, Clock } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import PlanningForm from './PlanningForm';

const DepartmentDetail = ({ dept, onBack }) => {
    const { departmentPlans, forumData, getDeptInfo, addReply, t, lang, user } = useProject();
    const [isPlanning, setIsPlanning] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const fullDeptInfo = getDeptInfo(dept.name);
    const signals = departmentPlans[dept.name] || [];

    const subForum = forumData[dept.name] || { topics: {} };
    const latestTopic = Object.values(subForum.topics).sort((a, b) => b.id.localeCompare(a.id))[0];

    const handleQuickReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim() || !latestTopic) return;
        await addReply(dept.name, latestTopic.id, replyContent);
        setReplyContent('');
    };

    const getSignalBadge = (type) => {
        switch (type) {
            case 'SYSTEM_UPDATE': return { icon: <ShieldCheck size={10} />, color: 'text-eternalgy-cyan', bg: 'bg-eternalgy-cyan/10', label: t('systemUpdate') };
            case 'FEEDBACK': return { icon: <MessageSquare size={10} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: t('versionFeedback') };
            case 'REQUEST': return { icon: <Sparkles size={10} />, color: 'text-eternalgy-slate', bg: 'bg-white/10', label: t('featureRequest') };
            default: return { icon: <Info size={10} />, color: 'text-white', bg: 'bg-white/10', label: 'Signal' };
        }
    }

    return (
        <div className="flex flex-col min-h-screen pb-32">
            {/* Header with Navigation */}
            <header className="p-6 flex items-center gap-4 border-b border-eternalgy-border sticky top-0 bg-eternalgy-bg/80 backdrop-blur-xl z-20 text-left">
                <button onClick={onBack} className="p-2 glass-card rounded-full border-0">
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold font-outfit uppercase tracking-wider">
                        {t('deptOf')} {dept.name}
                    </h1>
                    <p className="text-xs text-eternalgy-slate font-bold uppercase tracking-widest">{t('picFlow')}</p>
                </div>
            </header>

            {/* Authority Info Section */}
            <section className="p-6 grid grid-cols-2 gap-3 pb-0 text-left">
                <div className="glass-card p-4 border-eternalgy-cyan/20 flex flex-col gap-1 relative overflow-hidden">
                    <div className="absolute -right-2 -top-2 opacity-10 text-eternalgy-cyan">
                        <Cpu size={40} />
                    </div>
                    <span className="text-[9px] font-bold text-eternalgy-cyan uppercase tracking-widest flex items-center gap-1 leading-tight">
                        {t('lastUpdateIT')}
                    </span>
                    <span className="text-sm font-bold font-outfit text-white pt-1">{fullDeptInfo.lastUpdate}</span>
                </div>
                <div className="glass-card p-4 border-white/5 flex flex-col gap-1 relative overflow-hidden">
                    <div className="absolute -right-2 -top-2 opacity-5 text-eternalgy-slate">
                        <ClipboardList size={40} />
                    </div>
                    <span className="text-[9px] font-bold text-eternalgy-slate uppercase tracking-widest flex items-center gap-1 leading-tight">
                        {t('lastRequestHOD')}
                    </span>
                    <span className="text-sm font-bold font-outfit text-white pt-1">{fullDeptInfo.lastFeedback}</span>
                </div>
            </section>

            {/* Node Activity Section (LOGS) */}
            <section className="p-6 flex flex-col gap-6 text-left">
                <div className="glass-card p-6 border-white/5">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-xs font-bold tracking-widest text-eternalgy-slate uppercase flex items-center gap-2">
                            <Info size={14} className="text-eternalgy-cyan" /> DEPARTMENT TIMELINE
                        </h2>
                        <button
                            onClick={() => setIsPlanning(true)}
                            className="px-3 py-1.5 bg-eternalgy-cyan/10 hover:bg-eternalgy-cyan/20 rounded-lg text-eternalgy-cyan text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all"
                        >
                            <Plus size={14} /> {t('startPlanning')}
                        </button>
                    </div>

                    <div className="space-y-6 relative ml-2">
                        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-eternalgy-border/30" />

                        {signals.length > 0 ? (
                            signals.map((s, i) => {
                                const badge = getSignalBadge(s.type);
                                return (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={s.id} className="relative pl-6">
                                        <div className={`absolute -left-[5.5px] top-1 w-3 h-3 rounded-full border-2 border-eternalgy-bg ${badge.bg.replace('/10', '')}`} />
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${badge.bg} ${badge.color}`}>
                                                    {badge.icon} {badge.label}
                                                </div>
                                                <span className="text-[8px] text-eternalgy-slate font-bold uppercase tracking-widest flex items-center gap-1">
                                                    <Clock size={10} /> {s.timestamp}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-300 leading-relaxed font-inter">{s.content}</p>
                                            <p className="text-[9px] text-eternalgy-slate font-bold uppercase">Source: {s.author} ({s.role})</p>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="py-4 pl-6 opacity-30">
                                <p className="text-xs text-eternalgy-slate italic">"{t('sysFuncPlaceholder')}"</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex items-center gap-4 pt-6 border-t border-eternalgy-border/50">
                        <img src={fullDeptInfo.avatar} alt="" className="w-12 h-12 rounded-xl grayscale" />
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider">{fullDeptInfo.hod}</h4>
                            <p className="text-[10px] text-eternalgy-slate font-bold uppercase tracking-widest">{fullDeptInfo.role}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Neural Hub Preview Section */}
            <section className="p-6 pt-0 text-left">
                <header className="mb-4 flex justify-between items-end">
                    <h2 className="text-xs font-bold tracking-[0.2em] text-eternalgy-slate uppercase">{t('discussionFeed')}</h2>
                </header>

                <div className="glass-card border-white/5 overflow-hidden">
                    {latestTopic ? (
                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <MessageSquare size={12} className="text-eternalgy-cyan" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white">{latestTopic.title}</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-4 line-clamp-2 italic">"{latestTopic.content}"</p>

                            <div className="space-y-3 ml-4 border-l border-eternalgy-border/50 pl-4 mb-4">
                                {latestTopic.replies.slice(-2).map(r => (
                                    <div key={r.id} className="text-[11px] text-gray-300">
                                        <span className="text-eternalgy-cyan font-bold mr-2">{r.author}:</span>
                                        {r.content}
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleQuickReply} className="flex gap-2">
                                <input
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    className="flex-1 bg-white/5 border border-eternalgy-border rounded-lg px-3 py-2 text-[10px] focus:border-eternalgy-cyan outline-none"
                                    placeholder={t('participate')}
                                />
                                <button className="p-2 bg-eternalgy-cyan text-black rounded-lg">
                                    <Send size={14} />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="p-10 text-center">
                            <p className="text-xs text-eternalgy-slate uppercase tracking-widest">{t('noDiscussions')}</p>
                        </div>
                    )}
                </div>
            </section>

            <AnimatePresence>
                {isPlanning && (
                    <PlanningForm department={fullDeptInfo.name} onClose={() => setIsPlanning(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default DepartmentDetail;
