import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Share2, Repeat2, BadgeCheck, X, Send } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const DiscussionFeed = () => {
    const { neuralPosts, addPost } = useProject();
    const [showPostModal, setShowPostModal] = useState(false);
    const [content, setContent] = useState('');

    const handlePost = () => {
        if (!content.trim()) return;
        addPost(content);
        setContent('');
        setShowPostModal(false);
    };

    return (
        <div className="pb-24">
            <header className="p-6 border-b border-eternalgy-border sticky top-0 bg-eternalgy-bg/80 backdrop-blur-xl z-10">
                <h1 className="text-2xl font-bold font-outfit">Neural Flow</h1>
            </header>

            <div className="divide-y divide-eternalgy-border">
                {neuralPosts.map((post) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 flex gap-3"
                    >
                        <img src={post.avatar} className="w-12 h-12 rounded-full border border-eternalgy-border" alt="" />

                        <div className="flex-1">
                            <div className="flex items-center gap-1 text-sm">
                                <span className="font-bold">{post.user}</span>
                                {post.verified && <BadgeCheck size={14} className="text-eternalgy-cyan" />}
                                <span className="text-eternalgy-slate ml-1">@{post.handle} • {post.time}</span>
                            </div>

                            <p className="mt-1 text-[15px] leading-relaxed text-gray-200">
                                {post.content}
                            </p>

                            <div className="flex justify-between mt-4 text-eternalgy-slate max-w-[300px]">
                                <div className="flex items-center gap-2 hover:text-eternalgy-cyan transition-colors cursor-pointer">
                                    <MessageSquare size={16} /> <span className="text-xs">{post.replies}</span>
                                </div>
                                <div className="flex items-center gap-2 hover:text-eternalgy-cyan transition-colors cursor-pointer">
                                    <Repeat2 size={16} /> <span className="text-xs">{post.retweets}</span>
                                </div>
                                <div className="flex items-center gap-2 hover:text-eternalgy-cyan transition-colors cursor-pointer">
                                    <Heart size={16} /> <span className="text-xs">{post.likes}</span>
                                </div>
                                <div className="flex items-center gap-2 hover:text-eternalgy-cyan transition-colors cursor-pointer">
                                    <Share2 size={16} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPostModal(true)}
                className="fixed bottom-24 right-6 w-14 h-14 bg-eternalgy-cyan rounded-full flex items-center justify-center text-black shadow-lg shadow-eternalgy-cyan/30 z-20"
            >
                <MessageSquare />
            </motion.button>

            {/* Post Modal */}
            <AnimatePresence>
                {showPostModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/90 backdrop-blur-lg pt-20"
                    >
                        <div className="w-full max-w-md">
                            <div className="flex justify-between items-center mb-6">
                                <button onClick={() => setShowPostModal(false)}>
                                    <X size={24} className="text-white" />
                                </button>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handlePost}
                                    disabled={!content.trim()}
                                    className="px-6 py-2 bg-eternalgy-cyan text-black font-bold rounded-full disabled:opacity-50"
                                >
                                    Post
                                </motion.button>
                            </div>

                            <div className="flex gap-4">
                                <img src="https://i.pravatar.cc/150?u=head" className="w-12 h-12 rounded-full" alt="" />
                                <textarea
                                    autoFocus
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="What's happening in your department?"
                                    className="flex-1 bg-transparent border-none text-xl focus:ring-0 resize-none text-white h-60"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DiscussionFeed;
