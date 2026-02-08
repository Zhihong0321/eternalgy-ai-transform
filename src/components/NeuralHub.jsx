import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProject } from '../context/ProjectContext';
import { MessageSquare, ChevronRight, ChevronLeft, Plus, Send, User, Clock, MessageCircle } from 'lucide-react';
import TextEditor from './TextEditor';

const NeuralHub = () => {
    const { forumData, createTopic, addReply, t } = useProject();
    const [forumView, setForumView] = useState({ type: 'root', subForum: null, topic: null });
    const [newTopicModal, setNewTopicModal] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    // 1. Root View: List of Sub-forums
    const renderRoot = () => (
        <div className="flex flex-col">
            <header className="p-6 pb-2">
                <h2 className="text-xs font-bold tracking-[0.2em] text-eternalgy-slate uppercase mb-1">{t('neuralHub')}</h2>
                <h1 className="text-2xl font-bold font-outfit">{t('subForums')}</h1>
            </header>

            <div className="p-4 grid grid-cols-1 gap-3">
                {Object.values(forumData).map((sf) => (
                    <motion.div
                        key={sf.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setForumView({ type: 'subforum', subForum: sf, topic: null })}
                        className="glass-card p-4 flex items-center justify-between cursor-pointer border-white/5 hover:border-eternalgy-cyan/30"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-eternalgy-cyan/10 flex items-center justify-center text-eternalgy-cyan">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider">{sf.title}</h3>
                                <p className="text-[10px] text-eternalgy-slate line-clamp-1">{sf.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right mr-2">
                                <p className="text-[10px] font-bold text-white leading-none">{Object.keys(sf.topics).length}</p>
                                <p className="text-[8px] text-eternalgy-slate font-bold uppercase tracking-tight">{t('topics')}</p>
                            </div>
                            <ChevronRight size={16} className="text-eternalgy-slate" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    // 2. Sub-forum View: List of Topics
    const renderSubForum = (subForum) => (
        <div className="flex flex-col min-h-screen">
            <header className="p-6 sticky top-0 bg-eternalgy-bg/80 backdrop-blur-xl z-20 border-b border-eternalgy-border/30">
                <button onClick={() => setForumView({ type: 'root', subForum: null, topic: null })} className="flex items-center gap-1 text-[10px] font-bold text-eternalgy-cyan uppercase tracking-widest mb-2">
                    <ChevronLeft size={12} /> {t('backToHub')}
                </button>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold font-outfit uppercase tracking-tight">{subForum.title}</h1>
                    <button onClick={() => setNewTopicModal(true)} className="p-2 bg-eternalgy-cyan/10 rounded-lg text-eternalgy-cyan">
                        <Plus size={20} />
                    </button>
                </div>
            </header>

            <div className="divide-y divide-eternalgy-border/50">
                {Object.values(subForum.topics).length > 0 ? (
                    Object.values(subForum.topics).sort((a, b) => b.id.localeCompare(a.id)).map((topic) => (
                        <div
                            key={topic.id}
                            onClick={() => setForumView({ type: 'topic', subForum, topic })}
                            className="p-6 hover:bg-white/[0.02] cursor-pointer transition-colors"
                        >
                            <h3 className="font-bold text-sm text-white mb-2 leading-tight">{topic.title}</h3>
                            <div className="flex items-center gap-3 text-[10px] text-eternalgy-slate font-bold uppercase tracking-widest">
                                <span className="text-eternalgy-cyan">@{topic.author}</span>
                                <span>• {topic.time}</span>
                                <span className="flex items-center gap-1 ml-auto">
                                    <MessageCircle size={12} /> {topic.replies.length} {t('replies')}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-20 text-center text-eternalgy-slate uppercase text-xs tracking-widest">
                        {t('noDiscussions')}
                    </div>
                )}
            </div>
        </div>
    );

    // 3. Topic View: Threaded Replies
    const renderTopic = (subForum, topic) => (
        <div className="flex flex-col min-h-screen">
            <header className="p-6 sticky top-0 bg-eternalgy-bg/80 backdrop-blur-xl z-20 border-b border-eternalgy-border/30">
                <button onClick={() => setForumView({ type: 'subforum', subForum, topic: null })} className="flex items-center gap-1 text-[10px] font-bold text-eternalgy-cyan uppercase tracking-widest mb-2">
                    <ChevronLeft size={12} /> {t('backToForum')}
                </button>
                <h1 className="text-lg font-bold font-outfit text-white leading-tight">{topic.title}</h1>
            </header>

            {/* Main Post */}
            <div className="p-6 border-b border-eternalgy-border/50 bg-white/[0.01]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-eternalgy-cyan/10 flex items-center justify-center text-eternalgy-cyan">
                        <User size={16} />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-white uppercase tracking-wider">{topic.author}</p>
                        <p className="text-[10px] text-eternalgy-slate flex items-center gap-1 uppercase tracking-widest"><Clock size={10} /> {topic.time}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-eternalgy-cyan/30 pl-4">{topic.content}</p>
            </div>

            {/* Replies */}
            <div className="divide-y divide-eternalgy-border/30 pb-32">
                {topic.replies.map((reply) => (
                    <div key={reply.id} className="p-6 pl-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-eternalgy-cyan uppercase tracking-widest">{reply.author}</span>
                            <span className="text-[9px] text-eternalgy-slate uppercase tracking-widest">• {reply.time}</span>
                        </div>
                        <p className="text-sm text-gray-300">{reply.content}</p>
                    </div>
                ))}
            </div>

            {/* Quick Reply Bar */}
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-[340px] z-[60]">
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (!replyContent.trim()) return;
                        await addReply(subForum.id, topic.id, replyContent);
                        setReplyContent('');
                    }}
                    className="glass-card p-1.5 flex items-center px-4"
                >
                    <input
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={t('participate')}
                        className="flex-1 bg-transparent border-none text-xs focus:ring-0 placeholder-eternalgy-slate"
                    />
                    <button className="p-2 text-eternalgy-cyan">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );

    const renderContent = () => {
        if (!forumData || Object.keys(forumData).length === 0) {
            return (
                <div className="flex flex-col items-center justify-center p-20 opacity-30">
                    <p className="text-xs uppercase tracking-widest leading-loose text-center">System Synchronizing...</p>
                </div>
            );
        }
        switch (forumView.type) {
            case 'root': return renderRoot();
            case 'subforum': return renderSubForum(forumView.subForum);
            case 'topic': return renderTopic(forumData[forumView.subForum.id], forumData[forumView.subForum.id].topics[forumView.topic.id]);
            default: return renderRoot();
        }
    };

    return (
        <div className="min-h-screen">
            <AnimatePresence mode="wait">
                <motion.div
                    key={forumView.type + (forumView.subForum?.id || '') + (forumView.topic?.id || '')}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>

            {/* New Topic Modal */}
            <AnimatePresence>
                {newTopicModal && (
                    <NewTopicModal
                        subForumId={forumView.subForum.id}
                        onClose={() => setNewTopicModal(false)}
                        onSubmit={async (title, content) => {
                            const tid = await createTopic(forumView.subForum.id, title, content);
                            setForumView({ ...forumView, topic: { id: tid } });
                            setNewTopicModal(false);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const NewTopicModal = ({ subForumId, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { t } = useProject();

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full glass-card p-6 bg-eternalgy-bg max-w-sm">
                <h2 className="text-lg font-bold font-outfit mb-4">{t('newTopic')}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-eternalgy-slate uppercase tracking-widest block mb-1">{t('topicTitle')}</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white/5 border border-eternalgy-border rounded-lg p-2 text-sm focus:border-eternalgy-cyan outline-none"
                            placeholder="Subject of discussion..."
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-eternalgy-slate uppercase tracking-widest block mb-1">{t('content')}</label>
                        <TextEditor
                            value={content}
                            onChange={setContent}
                            placeholder="Details..."
                            minHeight="120px"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 py-3 text-xs font-bold uppercase text-eternalgy-slate">Cancel</button>
                        <button
                            onClick={() => onSubmit(title, content)}
                            disabled={!title.trim() || !content.trim()}
                            className="flex-1 py-3 bg-eternalgy-cyan text-black text-xs font-bold uppercase rounded-xl disabled:opacity-30 transition-all active:scale-95"
                        >
                            {t('createTopic')}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default NeuralHub;
