const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:tkaYtCcfkqfsWKjQguFMqIcANbJNcNZA@shinkansen.proxy.rlwy.net:34999/railway',
});

async function checkTables() {
    try {
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        const tables = res.rows.map(r => r.table_name);
        console.log('Total tables:', tables.length);
        console.log('Departments related:', tables.filter(t => t.includes('dept') || t.includes('department')));
        console.log('Forum related:', tables.filter(t => t.includes('forum')));
        console.log('User related:', tables.filter(t => t.includes('user')));
        console.log('Activity related:', tables.filter(t => t.includes('activity')));
    } catch (err) {
        console.error('Error checking tables:', err);
    } finally {
        await pool.end();
    }
}

checkTables();
