import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bold, Italic, Image as ImageIcon, Youtube, Link as LinkIcon, Type, X, Maximize2, Sparkles, Send } from 'lucide-react';

const TextEditor = ({ value, onChange, placeholder, onSend, minHeight = "200px" }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showMediaModal, setShowMediaModal] = useState(null); // 'image' or 'youtube'
    const editorRef = useRef(null);

    const handleAction = (type) => {
        // In a real app, this would apply formatting to selection
        // For the UI Demo, we'll show a "Neural Signal" notification or placeholder
        if (type === 'image' || type === 'youtube') {
            setShowMediaModal(type);
        }
    };

    return (
        <div className={`relative flex flex-col transition-all duration-500 rounded-2xl border ${isFocused ? 'border-eternalgy-cyan bg-eternalgy-cyan/5' : 'border-white/10 bg-white/5'} overflow-hidden`}>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-1">
                    <EditorButton icon={<Bold size={16} />} onClick={() => handleAction('bold')} title="Bold" />
                    <EditorButton icon={<Italic size={16} />} onClick={() => handleAction('italic')} title="Italic" />
                    <div className="w-[1px] h-4 bg-white/10 mx-1" />
                    <EditorButton icon={<ImageIcon size={16} />} onClick={() => handleAction('image')} title="Insert Image" />
                    <EditorButton icon={<Youtube size={16} />} onClick={() => handleAction('youtube')} title="Insert YouTube" />
                    <EditorButton icon={<LinkIcon size={16} />} onClick={() => handleAction('link')} title="Link" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold text-eternalgy-slate uppercase tracking-widest opacity-40">Neural Editor v1.0</span>
                    <Sparkles size={12} className="text-eternalgy-cyan animate-pulse" />
                </div>
            </div>

            {/* Input Area */}
            <textarea
                ref={editorRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder || "Synchronize your thoughts..."}
                className="w-full p-4 bg-transparent outline-none resize-none text-sm leading-relaxed text-gray-200 placeholder-eternalgy-slate/50 font-inter"
                style={{ minHeight }}
            />

            {/* Footer / Meta Area */}
            <div className="px-4 py-2 flex justify-between items-center text-[10px] text-eternalgy-slate font-bold uppercase tracking-widest border-t border-white/5 opacity-60">
                <div className="flex gap-4">
                    <span>{value.length} Characters</span>
                    <span>1 Neural Node</span>
                </div>
                {onSend && (
                    <button
                        onClick={onSend}
                        className="flex items-center gap-1.5 text-eternalgy-cyan hover:text-white transition-colors"
                    >
                        Process <Send size={10} />
                    </button>
                )}
            </div>

            {/* Mock Media Modals */}
            <AnimatePresence>
                {showMediaModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-eternalgy-bg/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
                    >
                        <button
                            onClick={() => setShowMediaModal(null)}
                            className="absolute top-4 right-4 p-2 text-eternalgy-slate hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <div className={`w-16 h-16 rounded-2xl bg-eternalgy-cyan/10 flex items-center justify-center text-eternalgy-cyan mb-4 border border-eternalgy-cyan/20`}>
                            {showMediaModal === 'image' ? <ImageIcon size={32} /> : <Youtube size={32} />}
                        </div>

                        <h3 className="text-lg font-bold font-outfit uppercase tracking-tight">
                            {showMediaModal === 'image' ? 'Neural Signal Image' : 'Neural Stream (YouTube)'}
                        </h3>
                        <p className="text-xs text-eternalgy-slate mt-2 max-w-[200px]">
                            {showMediaModal === 'image' ? 'Upload static visual data to synchronize with the node.' : 'Link a real-time visual stream to the neural network.'}
                        </p>

                        <input
                            placeholder={showMediaModal === 'image' ? "Enter Image URI..." : "Enter YouTube URL..."}
                            className="mt-6 w-full max-w-[240px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-eternalgy-cyan outline-none"
                        />

                        <button
                            onClick={() => {
                                // Mock behavior: append placeholder text
                                const tag = showMediaModal === 'image' ? '\n![Neural Image Placeholder](https://example.com/image.jpg)\n' : '\n@[YouTube Stream Placeholder](https://youtube.com/watch?v=...)\n';
                                onChange(value + tag);
                                setShowMediaModal(null);
                            }}
                            className="mt-4 px-8 py-3 bg-eternalgy-cyan text-black font-bold uppercase text-[10px] rounded-xl tracking-[0.2em]"
                        >
                            Confirm Sync
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const EditorButton = ({ icon, onClick, title }) => (
    <button
        onClick={onClick}
        title={title}
        className="p-1.5 text-eternalgy-slate hover:text-eternalgy-cyan hover:bg-eternalgy-cyan/10 rounded-lg transition-all"
    >
        {icon}
    </button>
);

export default TextEditor;
