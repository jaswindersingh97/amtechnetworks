const { Pool } = require('pg');

const pool = new Pool({
    user: 'yourUsername',
    host: 'localhost',
    database: 'yourDatabase',
    password: 'yourPassword',
    port: 5432,
});

async function queryDatabase() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log(res.rows[0]);
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await pool.end();
    }
}

module.exports = queryDatabase;