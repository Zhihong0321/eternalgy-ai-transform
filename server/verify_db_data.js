const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:tkaYtCcfkqfsWKjQguFMqIcANbJNcNZA@shinkansen.proxy.rlwy.net:34999/railway',
});

async function verifyData() {
    try {
        const res = await pool.query("SELECT * FROM departments");
        console.log('--- DATABASE DATA VERIFICATION ---');
        console.log('Seeded Departments found:', res.rows.length);
        console.log('Department Info:');
        res.rows.forEach(dept => {
            console.log(`- ID: ${dept.id}, NAME: ${dept.name}, HOD: ${dept.hod_name}, STATUS: ${dept.status_update}`);
        });
        console.log('-----------------------------------');

        const topics = await pool.query("SELECT count(*) FROM forum_topics");
        console.log('Forum Topics in DB:', topics.rows[0].count);

    } catch (err) {
        console.error('Error verifying DB data:', err);
    } finally {
        await pool.end();
    }
}

verifyData();
