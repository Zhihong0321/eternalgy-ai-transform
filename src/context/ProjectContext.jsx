import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../constants/translations';

const ProjectContext = createContext();
const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

export const useProject = () => useContext(ProjectContext);

const mockUsers = [
    { id: 1, name: 'System Designer', role: 'SUPER_ADMIN', avatar: 'https://i.pravatar.cc/150?u=designer' },
    { id: 2, name: 'Admin User', role: 'ADMIN', avatar: 'https://i.pravatar.cc/150?u=admin' },
    { id: 3, name: 'HoD User', role: 'USER', avatar: 'https://i.pravatar.cc/150?u=hod' },
];

export const ProjectProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('eternalgy_theme') || 'dark');
    const [lang, setLang] = useState(() => localStorage.getItem('eternalgy_lang') || 'en');
    const [user, setUser] = useState(mockUsers[0]);

    const [allDepts, setAllDepts] = useState([]);
    const [forumData, setForumData] = useState({});
    const [departmentPlans, setDepartmentPlans] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const deptsRes = await fetch(`${API_BASE}/departments`);
            const deptsData = await deptsRes.json();

            // Map DB structure to UI structure
            const mappedDepts = deptsData.map(d => ({
                id: d.id,
                name: d.dept_id.toString(),
                hod: d.hod_name || 'Department Head',
                role: 'HoD',
                avatar: d.hod_avatar || 'https://i.pravatar.cc/150?u=generic',
                version: d.status_update || 'v1.0.0',
                lastUpdate: d.last_updated ? new Date(d.last_updated).toLocaleString() : 'Never',
                lastFeedback: 'N/A',
                visible: d.is_visible !== false,
                percent: d.percent_complete || 0
            }));
            setAllDepts(mappedDepts);

            // Fetch forums for each dept (Global + Depts)
            const forumObj = {};
            const nodes = ['GLOBAL', ...mappedDepts.map(d => d.name)];
            for (const node of nodes) {
                const topicsRes = await fetch(`${API_BASE}/forum/topics/${node}`);
                const topicsData = await topicsRes.json();

                const topicsMap = {};
                for (const t of topicsData) {
                    const repliesRes = await fetch(`${API_BASE}/forum/replies/${t.id}`);
                    const repliesData = await repliesRes.json();
                    topicsMap[t.id] = {
                        id: t.id.toString(),
                        author: t.author_name,
                        title: t.title,
                        content: t.content,
                        time: new Date(t.created_at).toLocaleString(),
                        replies: repliesData.map(r => ({
                            id: r.id.toString(),
                            author: r.author_name,
                            content: r.content,
                            time: new Date(r.created_at).toLocaleString()
                        }))
                    };
                }
                forumObj[node] = {
                    id: node,
                    title: node,
                    description: node === 'GLOBAL' ? 'System-wide discussions' : `Neural discussion space for ${node}`,
                    topics: topicsMap
                };
            }
            setForumData(forumObj);

            // Fetch activity feeds
            const plansObj = {};
            for (const dept of mappedDepts) {
                const feedRes = await fetch(`${API_BASE}/activity-feed/${dept.id}`);
                const feedData = await feedRes.json();
                plansObj[dept.name] = feedData.map(f => ({
                    id: f.id.toString(),
                    type: f.is_pinned ? 'SYSTEM_UPDATE' : 'REQUEST', // Simplification for demo
                    content: lang === 'en' ? f.content_en : f.content_cn,
                    timestamp: new Date(f.created_at).toLocaleString(),
                    author: f.author_name,
                    role: 'USER'
                }));
            }
            setDepartmentPlans(plansObj);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setLoading(false);
        }
    }, [lang]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        localStorage.setItem('eternalgy_theme', theme);
        document.documentElement.className = theme;
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('eternalgy_lang', lang);
    }, [lang]);

    const addPlanSignal = async (deptName, type, content) => {
        const dept = allDepts.find(d => d.name === deptName);
        if (!dept) return;

        await fetch(`${API_BASE}/activity-feed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dept_metadata_id: dept.id,
                author_id: user.id,
                content_en: content,
                content_cn: content, // Placeholder for actual translation
                is_pinned: type === 'SYSTEM_UPDATE'
            })
        });
        fetchData();
    };

    const createTopic = async (subForumId, title, content) => {
        const res = await fetch(`${API_BASE}/forum/topics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dept_name: subForumId,
                author_name: user.name,
                title,
                content
            })
        });
        const data = await res.json();
        fetchData();
        return data.id.toString();
    };

    const addReply = async (subForumId, topicId, content) => {
        await fetch(`${API_BASE}/forum/replies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic_id: parseInt(topicId),
                author_name: user.name,
                content
            })
        });
        fetchData();
    };

    const updateDept = async (deptId, data) => {
        const payload = {
            id: deptId === 'NEW' ? null : deptId,
            name: data.name,
            hod_name: data.hod,
            status_update: data.version,
            description_en: data.description || '',
            percent_complete: data.percent || 0,
            is_visible: data.visible !== false
        };

        await fetch(`${API_BASE}/departments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        fetchData();
    };

    const toggleDeptVisibility = async (deptId) => {
        const dept = allDepts.find(d => d.id === deptId);
        if (!dept) return;

        await fetch(`${API_BASE}/departments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: deptId,
                name: dept.name,
                is_visible: !dept.visible
            })
        });
        fetchData();
    };

    const updateSystemDateAll = async () => {
        const promises = allDepts.filter(d => d.visible).map(dept =>
            fetch(`${API_BASE}/departments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: dept.id,
                    name: dept.name
                })
            })
        );
        await Promise.all(promises);
        fetchData();
    };

    const createSubForum = (id, title, description) => {
        setForumData(prev => ({
            ...prev, [id]: { id, title, description, topics: {} }
        }));
    };

    const getDeptInfo = (deptName) => {
        return allDepts.find(d => d.name === deptName) || {
            name: deptName, hod: 'Department Head', role: 'Head of Department', avatar: 'https://i.pravatar.cc/150?u=generic',
            version: 'v1.0.0', lastUpdate: 'N/A', lastFeedback: 'N/A', visible: true
        };
    };

    const t = (key) => translations[lang][key] || key;

    return (
        <ProjectContext.Provider value={{
            user, setUser, mockUsers,
            departmentPlans, addPlanSignal,
            forumData, createTopic, addReply, createSubForum,
            allDepts, updateDept, toggleDeptVisibility, updateSystemDateAll,
            getDeptInfo,
            theme, setTheme, toggleTheme: () => setTheme(prev => prev === 'dark' ? 'light' : 'dark'),
            lang, setLang, t,
            loading
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

