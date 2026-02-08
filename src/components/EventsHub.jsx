import React from 'react';
import Timeline from './Timeline';
import { motion } from 'framer-motion';

import { useProject } from '../context/ProjectContext';

const EventsHub = () => {
    const { t } = useProject();
    return (
        <div className="flex flex-col min-h-screen">
            <header className="p-6 sticky top-0 bg-eternalgy-bg/80 backdrop-blur-xl z-20 border-b border-eternalgy-border/50">
                <h1 className="text-2xl font-bold font-outfit tracking-tight">{t('roadmap').split(' • ')[0]}</h1>
                <p className="text-xs text-eternalgy-slate font-bold uppercase tracking-widest mt-1">{t('roadmap')}</p>
            </header>

            <div className="p-6 bg-eternalgy-cyan/5 border-b border-eternalgy-cyan/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-eternalgy-cyan/20 rounded-lg text-eternalgy-cyan">
                        <span className="font-bold text-xs uppercase">Live</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-eternalgy-slate font-bold uppercase tracking-widest">Active Department</p>
                        <h3 className="text-sm font-bold font-outfit uppercase">Phase 4 Digitalization Sync</h3>
                    </div>
                </div>
            </div>

            <Timeline />
        </div>
    );
};

export default EventsHub;
