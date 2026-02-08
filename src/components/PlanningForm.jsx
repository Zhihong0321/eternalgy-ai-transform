import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, ShieldCheck, MessageSquare, Sparkles, CheckCircle, Users } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import TextEditor from './TextEditor';

const PlanningForm = ({ department, onClose }) => {
    const { addPlanSignal, t, user } = useProject();
    const [content, setContent] = useState('');
    const [type, setType] = useState('REQUEST');
    const [isSuccess, setIsSuccess] = useState(false);

    const isDesigner = user.role === 'SUPER_ADMIN';

    const types = [
        { id: 'MEETING', label: t('nodeCoordination'), icon: <Users size={14} />, color: 'text-green-500', bg: 'bg-green-500/10' },
        { id: 'REQUEST', label: t('featureRequest'), icon: <Sparkles size={14} />, color: 'text-eternalgy-slate', bg: 'bg-white/5' },
        { id: 'FEEDBACK', label: t('versionFeedback'), icon: <MessageSquare size={14} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    ];

    if (isDesigner) {
        types.push({ id: 'SYSTEM_UPDATE', label: t('systemUpdate'), icon: <ShieldCheck size={14} />, color: 'text-eternalgy-cyan', bg: 'bg-eternalgy-cyan/10' });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        await addPlanSignal(department, type, content);
        setIsSuccess(true);
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-eternalgy-bg/90 backdrop-blur-2xl flex items-center justify-center p-6 text-left"
        >
            <div className="w-full max-w-sm glass-card p-8 border-white/10 relative overflow-hidden">
                <button onClick={onClose} className="absolute top-6 right-6 text-eternalgy-slate hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold font-outfit mb-2">{t('picPlanning')}</h2>
                <p className="text-[10px] text-eternalgy-slate font-bold uppercase tracking-widest mb-8">{department} Department</p>

                {isSuccess ? (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="py-20 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-eternalgy-cyan/20 border border-eternalgy-cyan/40 flex items-center justify-center text-eternalgy-cyan shadow-[0_0_30px_rgba(0,242,255,0.2)]">
                            <CheckCircle size={32} />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">{t('successLogged')}</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-bold text-eternalgy-slate uppercase tracking-widest block mb-3">Signal Type</label>
                            <div className="grid grid-cols-1 gap-2">
                                {types.map(t => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setType(t.id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${type === t.id ? 'border-eternalgy-cyan bg-eternalgy-cyan/5' : 'border-white/5 bg-white/[0.02]'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${t.bg} ${t.color}`}>
                                            {t.icon}
                                        </div>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${type === t.id ? 'text-white' : 'text-eternalgy-slate'}`}>
                                            {t.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-eternalgy-slate uppercase tracking-widest block mb-3">{t('content')}</label>
                            <TextEditor
                                value={content}
                                onChange={setContent}
                                placeholder={t('reqPlaceholder')}
                                minHeight="120px"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!content.trim()}
                            className="w-full py-4 bg-eternalgy-cyan text-black font-bold uppercase tracking-[0.2em] text-xs rounded-xl shadow-[0_0_30px_rgba(0,242,255,0.3)] disabled:opacity-30 disabled:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Send size={16} /> {t('submitPlan')}
                        </button>
                    </form>
                )}
            </div>
        </motion.div>
    );
};

export default PlanningForm;
