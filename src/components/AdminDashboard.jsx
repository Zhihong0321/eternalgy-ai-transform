import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Users, Database, ShieldCheck, ChevronRight, Edit3, Eye, EyeOff, CheckCircle, X, Plus, AlertCircle, RefreshCw, Calendar } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const AdminDashboard = ({ onBack }) => {
    const { user, allDepts, updateDept, toggleDeptVisibility, updateSystemDateAll, mockUsers, setUser, t } = useProject();
    const [activeTab, setActiveTab] = useState('depts');
    const [editingDept, setEditingDept] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    // UI-only demo state
    const [forumSettings, setForumSettings] = useState({
        moderation: true,
        publicNodes: false,
        autoArchive: true
    });

    const isSuperAdmin = user.role === 'SUPER_ADMIN';
    const isAdmin = user.role === 'ADMIN' || isSuperAdmin;

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-screen">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h1 className="text-xl font-bold">{t('accessDenied')}</h1>
                <p className="text-xs text-eternalgy-slate mt-2">{t('noPermission')}</p>
                <button onClick={onBack} className="mt-6 px-6 py-2 bg-eternalgy-cyan text-black font-bold rounded-lg text-xs">{t('back')}</button>
            </div>
        );
    }

    const renderDepts = () => (
        <div className="space-y-4">
            <button
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-eternalgy-border rounded-xl text-eternalgy-slate hover:text-eternalgy-cyan hover:border-eternalgy-cyan transition-all mb-4"
            >
                <Plus size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">{t('createNode')}</span>
            </button>

            <div className="space-y-3">
                {allDepts.map(dept => (
                    <div key={dept.id} className={`glass-card p-4 flex items-center justify-between border-white/5 ${!dept.visible ? 'opacity-40 grayscale' : ''}`}>
                        <div className="text-left">
                            <h3 className="font-bold text-sm">{dept.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[8px] font-bold text-eternalgy-cyan uppercase tracking-tighter bg-eternalgy-cyan/10 px-1.5 py-0.5 rounded">{dept.version}</span>
                                <p className="text-[10px] text-eternalgy-slate uppercase font-bold tracking-widest">HoD: {dept.hod}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => toggleDeptVisibility(dept.id)}
                                className={`p-2 rounded-lg transition-colors ${dept.visible ? 'text-eternalgy-cyan bg-eternalgy-cyan/10' : 'text-eternalgy-slate bg-white/5'}`}
                            >
                                {dept.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            <button
                                onClick={() => setEditingDept(dept)}
                                className="p-2 rounded-lg bg-white/5 text-white"
                            >
                                <Edit3 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="space-y-3 text-left">
            <div className="p-4 bg-eternalgy-cyan/5 border border-eternalgy-cyan/20 rounded-xl mb-6">
                <p className="text-[9px] font-bold text-eternalgy-cyan uppercase tracking-[0.2em] mb-1">{t('dbSync')}</p>
                <p className="text-xs text-gray-300">{t('connectedTo')} <span className="text-white font-bold">Eternalgy User Core</span> v3.4</p>
            </div>

            {mockUsers.map(u => (
                <div key={u.id} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={u.avatar} className="w-8 h-8 rounded-lg" alt="" />
                        <div className="text-left">
                            <h3 className="font-bold text-sm">{u.name}</h3>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${u.role === 'SUPER_ADMIN' ? 'bg-purple-500/20 text-purple-400' : u.role === 'ADMIN' ? 'bg-eternalgy-cyan/20 text-eternalgy-cyan' : 'bg-white/10 text-eternalgy-slate'}`}>
                                {u.role}
                            </span>
                        </div>
                    </div>
                    {isSuperAdmin && (
                        <select
                            value={u.role}
                            onChange={(e) => { }} // Placeholder for actual update
                            className="bg-transparent border-none text-[10px] font-bold text-eternalgy-cyan outline-none cursor-pointer"
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="SUPER_ADMIN">SUPER ADMIN</option>
                        </select>
                    )}
                </div>
            ))}
        </div>
    );

    const renderSystem = () => (
        <div className="space-y-6 text-left">
            <div className="glass-card p-6 border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-eternalgy-cyan mb-2 flex items-center gap-2">
                    <RefreshCw size={16} /> {t('nodesSync')}
                </h3>
                <p className="text-xs text-eternalgy-slate mb-6">Instantly update the last system update timestamp for all visible departments.</p>
                <button
                    onClick={() => {
                        if (confirm('Sync all nodes now?')) updateSystemDateAll();
                    }}
                    className="w-full py-4 bg-gradient-to-r from-eternalgy-cyan to-blue-500 text-black font-bold uppercase text-xs rounded-xl shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all active:scale-95"
                >
                    {t('syncNow')}
                </button>
            </div>

            <div className="glass-card p-6 border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                    <ShieldCheck size={16} /> {t('forumControls')}
                </h3>

                <div className="space-y-4">
                    <AdminToggle
                        label="Neural Moderation"
                        sub="Filter hazardous signals"
                        active={forumSettings.moderation}
                        onClick={() => setForumSettings(prev => ({ ...prev, moderation: !prev.moderation }))}
                    />
                    <AdminToggle
                        label="Allow Public Nodes"
                        sub="External observer access"
                        active={forumSettings.publicNodes}
                        onClick={() => setForumSettings(prev => ({ ...prev, publicNodes: !prev.publicNodes }))}
                    />
                    <AdminToggle
                        label="Auto-Archive Topics"
                        sub="Optimize neural storage"
                        active={forumSettings.autoArchive}
                        onClick={() => setForumSettings(prev => ({ ...prev, autoArchive: !prev.autoArchive }))}
                    />
                </div>

                <button className="w-full mt-8 py-3 border border-dashed border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-eternalgy-slate hover:text-eternalgy-cyan hover:border-eternalgy-cyan/30 transition-all">
                    + Add New Sub-Forum Department
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen">
            <header className="p-6 bg-eternalgy-bg/80 backdrop-blur-xl sticky top-0 z-20 border-b border-eternalgy-border/50 text-left">
                <button onClick={onBack} className="flex items-center gap-1 text-[10px] font-bold text-eternalgy-cyan uppercase tracking-widest mb-2">
                    <ChevronRight size={12} className="rotate-180" /> {t('back')}
                </button>
                <h1 className="text-2xl font-bold font-outfit">{t('controlCenter')}</h1>
                <p className="text-[10px] text-eternalgy-slate font-bold uppercase tracking-widest mt-1">
                    System Identity: <span className="text-white">{user.name}</span> • <span className="text-eternalgy-cyan">[{user.role}]</span>
                </p>
            </header>

            {/* Tabs */}
            <div className="flex px-4 pt-4 border-b border-eternalgy-border/30">
                <button onClick={() => setActiveTab('depts')} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'depts' ? 'border-eternalgy-cyan text-eternalgy-cyan' : 'border-transparent text-eternalgy-slate'}`}>
                    {t('activeNodes').split(' ')[1] || t('activeNodes')}
                </button>
                <button onClick={() => setActiveTab('users')} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'users' ? 'border-eternalgy-cyan text-eternalgy-cyan' : 'border-transparent text-eternalgy-slate'}`}>
                    {t('accessControl').split(' ')[0]}
                </button>
                {isSuperAdmin && (
                    <button onClick={() => setActiveTab('system')} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'system' ? 'border-eternalgy-cyan text-eternalgy-cyan' : 'border-transparent text-eternalgy-slate'}`}>
                        System
                    </button>
                )}
            </div>

            <div className="p-6 pb-32">
                {activeTab === 'depts' && renderDepts()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'system' && isSuperAdmin && renderSystem()}
            </div>

            <AnimatePresence>
                {(editingDept || isCreating) && (
                    <EditDeptModal
                        dept={editingDept || { name: '', hod: '', version: 'v1.0.0', lastUpdate: '02-08 12:00 AM' }}
                        isNew={!!isCreating}
                        onClose={() => { setEditingDept(null); setIsCreating(false); }}
                        onSave={(data) => {
                            if (isCreating) {
                                updateDept('NEW', data);
                            } else {
                                updateDept(editingDept.id, data);
                            }
                            setEditingDept(null);
                            setIsCreating(false);
                        }}
                        isSuperAdmin={isSuperAdmin}
                        t={t}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const AdminToggle = ({ label, sub, active, onClick }) => (
    <div className="flex items-center justify-between">
        <div>
            <p className="text-[10px] font-bold text-white uppercase tracking-widest">{label}</p>
            <p className="text-[8px] text-eternalgy-slate uppercase font-bold tracking-widest">{sub}</p>
        </div>
        <button
            onClick={onClick}
            className={`w-10 h-5 rounded-full transition-all relative ${active ? 'bg-eternalgy-cyan' : 'bg-white/10'}`}
        >
            <motion.div
                animate={{ x: active ? 22 : 2 }}
                className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-lg"
            />
        </button>
    </div>
);

const EditDeptModal = ({ dept, onClose, onSave, isNew, isSuperAdmin, t }) => {
    const [formData, setFormData] = useState({
        name: dept.name,
        hod: dept.hod,
        version: dept.version,
        lastUpdate: dept.lastUpdate
    });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 text-left">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full glass-card p-6 bg-eternalgy-bg max-w-sm">
                <h2 className="text-lg font-bold font-outfit mb-4">{isNew ? t('createNode') : `${t('editNode')}: ${dept.name}`}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-eternalgy-slate uppercase tracking-widest block mb-1">{t('nodeName')}</label>
                        <input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/5 border border-eternalgy-border rounded-lg p-2 text-sm text-white outline-none focus:border-eternalgy-cyan"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-eternalgy-slate uppercase tracking-widest block mb-1">{t('hodName')}</label>
                        <input
                            value={formData.hod}
                            onChange={(e) => setFormData({ ...formData, hod: e.target.value })}
                            className="w-full bg-white/5 border border-eternalgy-border rounded-lg p-2 text-sm text-white outline-none focus:border-eternalgy-cyan"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-eternalgy-slate uppercase tracking-widest block mb-1">{t('version')}</label>
                            <input
                                value={formData.version}
                                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                className="w-full bg-white/5 border border-eternalgy-border rounded-lg p-2 text-sm text-white outline-none focus:border-eternalgy-cyan"
                            />
                        </div>
                        {isSuperAdmin && (
                            <div>
                                <label className="text-[10px] font-bold text-eternalgy-slate uppercase tracking-widest block mb-1 flex items-center gap-1"><Calendar size={10} /> {t('dateTime')}</label>
                                <input
                                    value={formData.lastUpdate}
                                    onChange={(e) => setFormData({ ...formData, lastUpdate: e.target.value })}
                                    className="w-full bg-white/5 border border-eternalgy-border rounded-lg p-2 text-[10px] text-white outline-none focus:border-eternalgy-cyan"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button onClick={onClose} className="flex-1 py-3 text-xs font-bold uppercase text-eternalgy-slate">{t('cancel')}</button>
                        <button
                            onClick={() => onSave(formData)}
                            className="flex-1 py-3 bg-eternalgy-cyan text-black text-xs font-bold uppercase rounded-xl transition-all active:scale-95"
                        >
                            {isNew ? t('createNode') : t('updateNode')}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;
