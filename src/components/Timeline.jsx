import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const Timeline = () => {
    const { t } = useProject();

    const events = [
        {
            time: '08:00 AM',
            title: t('teamAlignment'),
            location: t('meetingRoom'),
            date: 'January 3, 2026',
            status: 'completed'
        },
        {
            time: '09:00 AM',
            title: t('presentPlan'),
            location: t('meetingRoom'),
            date: 'January 3, 2026',
            status: 'current'
        },
        {
            time: '11:30 AM',
            title: t('deptSync'),
            location: t('virtualOffice'),
            date: 'January 3, 2026',
            status: 'upcoming'
        }
    ];

    return (
        <div className="p-6 pb-24">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                    {t('upcomingMilestone').split(' ')[1] || 'Milestones'}
                </h1>
                <p className="text-eternalgy-slate text-sm mt-1">{t('activeNodes')} - {t('roadmap').split(' • ')[1]}</p>
            </header>

            <div className="relative pl-8">
                {/* Continuous Neural Line */}
                <div className="neural-line left-4 top-2 bottom-0 w-[1px] opacity-20" />

                {events.map((event, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="mb-10 relative"
                    >
                        {/* Connection Point */}
                        <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-eternalgy-bg z-10 
              ${event.status === 'completed' ? 'bg-eternalgy-cyan' :
                                event.status === 'current' ? 'bg-white cyan-glow' : 'bg-eternalgy-slate'}`}
                        />

                        <div className="glass-card p-5 relative overflow-hidden">
                            {event.status === 'current' && (
                                <div className="absolute top-0 right-0 p-2">
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eternalgy-cyan opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-eternalgy-cyan"></span>
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-eternalgy-cyan font-outfit font-bold text-sm">
                                    <Clock size={14} />
                                    {event.time}
                                </div>

                                <h3 className="text-lg font-bold leading-tight">{event.title}</h3>

                                <div className="flex items-center gap-4 mt-2 text-xs text-eternalgy-slate">
                                    <span className="flex items-center gap-1">
                                        <MapPin size={12} /> {event.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} /> {event.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
