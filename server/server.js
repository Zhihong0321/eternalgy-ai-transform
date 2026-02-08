const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:tkaYtCcfkqfsWKjQguFMqIcANbJNcNZA@shinkansen.proxy.rlwy.net:34999/railway',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// --- Database Initialization (New Tables for Forum) ---
async function initDb() {
    const client = await pool.connect();
    try {
        // Core Departments Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        hod_user_id INTEGER,
        hod_name TEXT,
        description_en TEXT,
        description_cn TEXT,
        color_theme TEXT DEFAULT '#00F2FF',
        status_update TEXT DEFAULT 'v1.0.0',
        percent_complete INTEGER DEFAULT 0,
        is_visible BOOLEAN DEFAULT TRUE,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        await client.query('ALTER TABLE departments ADD COLUMN IF NOT EXISTS hod_name TEXT;');

        await client.query(`
      CREATE TABLE IF NOT EXISTS forum_topics (
        id SERIAL PRIMARY KEY,
        dept_name TEXT NOT NULL,
        author_name TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        await client.query(`
      CREATE TABLE IF NOT EXISTS forum_replies (
        id SERIAL PRIMARY KEY,
        topic_id INTEGER REFERENCES forum_topics(id) ON DELETE CASCADE,
        author_name TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Migration/Seed Logic: Only if empty
        const { rows } = await client.query('SELECT count(*) FROM departments');
        if (parseInt(rows[0].count) === 0) {
            console.log('Seeding initial departments...');
            const seedDepts = [
                ['SALES', 'Department of Sales & Growth'],
                ['ENGINEERING', 'Engineering & Innovation'],
                ['FINANCE', 'Finance & Procurement'],
                ['IT', 'Information Technology'],
                ['O&M', 'Operations & Maintenance'],
                ['SEDA', 'SEDA Compliance & Sustainability'],
                ['C&I', 'C&I Project Execution'],
                ['CULTURE', 'People & Culture']
            ];
            for (const [name, desc] of seedDepts) {
                await client.query('INSERT INTO departments (name, description_en) VALUES ($1, $2)', [name, desc]);
            }
        }

        console.log('Database initialized (departments and forum tables ensured)');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        client.release();
    }
}
initDb();

// --- API Endpoints ---

// Get all departments with progress and metadata
app.get('/api/departments', async (req, res) => {
    try {
        const query = `
      SELECT 
        d.id, 
        d.name as dept_id, 
        d.color_theme, 
        d.description_en, 
        d.description_cn,
        d.status_update,
        COALESCE(u.name, d.hod_name) as hod_name,
        u.profile_picture as hod_avatar,
        d.percent_complete as percent_complete,
        d.last_updated,
        d.is_visible
      FROM departments d
      LEFT JOIN "user" u ON d.hod_user_id = u.id
      ORDER BY d.id ASC
    `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/departments', async (req, res) => {
    try {
        const { id, name, hod_user_id, hod_name, status_update, description_en, percent_complete, is_visible } = req.body;

        if (id) {
            // Update
            const { rows } = await pool.query(
                'UPDATE departments SET name=$1, hod_user_id=$2, hod_name=$3, status_update=$4, description_en=$5, percent_complete=$6, is_visible=$7, last_updated=NOW() WHERE id=$8 RETURNING *',
                [name, hod_user_id || null, hod_name || '', status_update, description_en || '', percent_complete || 0, is_visible !== undefined ? is_visible : true, id]
            );
            res.json(rows[0]);
        } else {
            // Create
            const { rows } = await pool.query(
                'INSERT INTO departments (name, hod_user_id, hod_name, status_update, description_en, percent_complete, is_visible, last_updated) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
                [name, hod_user_id || null, hod_name || '', status_update || 'v1.0.0', description_en || '', percent_complete || 0, true]
            );
            res.status(201).json(rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get activity feed for a department
app.get('/api/activity-feed/:deptMetadataId', async (req, res) => {
    try {
        const { deptMetadataId } = req.params;
        const { rows } = await pool.query(
            'SELECT f.*, u.name as author_name FROM _activity_feed f LEFT JOIN "user" u ON f.author_id = u.id WHERE dept_metadata_id = $1 ORDER BY created_at DESC',
            [deptMetadataId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Post activity signal
app.post('/api/activity-feed', async (req, res) => {
    try {
        const { dept_metadata_id, author_id, content_en, content_cn, is_pinned } = req.body;
        const { rows } = await pool.query(
            'INSERT INTO _activity_feed (dept_metadata_id, author_id, content_en, content_cn, is_pinned, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
            [dept_metadata_id, author_id, content_en, content_cn, is_pinned || false]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Forum: Get topics for a specific department (or GLOBAL)
app.get('/api/forum/topics/:deptName', async (req, res) => {
    try {
        const { deptName } = req.params;
        const { rows } = await pool.query(
            'SELECT * FROM forum_topics WHERE dept_name = $1 ORDER BY created_at DESC',
            [deptName]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Forum: Get replies for a topic
app.get('/api/forum/replies/:topicId', async (req, res) => {
    try {
        const { topicId } = req.params;
        const { rows } = await pool.query(
            'SELECT * FROM forum_replies WHERE topic_id = $1 ORDER BY created_at ASC',
            [topicId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Forum: Create topic
app.post('/api/forum/topics', async (req, res) => {
    try {
        const { dept_name, author_name, title, content } = req.body;
        const { rows } = await pool.query(
            'INSERT INTO forum_topics (dept_name, author_name, title, content) VALUES ($1, $2, $3, $4) RETURNING *',
            [dept_name, author_name, title, content]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Forum: Create reply
app.post('/api/forum/replies', async (req, res) => {
    try {
        const { topic_id, author_name, content } = req.body;
        const { rows } = await pool.query(
            'INSERT INTO forum_replies (topic_id, author_name, content) VALUES ($1, $2, $3) RETURNING *',
            [topic_id, author_name, content]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Calendar: Get events
app.get('/api/calendar', async (req, res) => {
    try {
        const appointments = await pool.query('SELECT * FROM calendar_appointments');
        const tasks = await pool.query('SELECT * FROM calendar_tasks');
        res.json({ appointments: appointments.rows, tasks: tasks.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Serve Static Frontend in Production ---
const buildPath = path.join(__dirname, '..', 'dist');
app.use(express.static(buildPath));

app.get('(.*)', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
