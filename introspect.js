
import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:tkaYtCcfkqfsWKjQguFMqIcANbJNcNZA@shinkansen.proxy.rlwy.net:34999/railway';

async function introspect() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Connected to database');

        const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        console.log('Tables:', tablesRes.rows.map(r => r.table_name));

        for (const row of tablesRes.rows) {
            const tableName = row.table_name;
            const columnsRes = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = $1
      `, [tableName]);
            console.log(`\nTable: ${tableName}`);
            console.table(columnsRes.rows);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

introspect();
