const Pool = require('pg').Pool;

const pool = new Pool({
	user: 'postgres',
	password: 'pilmaagar1',
	host: 'localhost',
	port: 5432,
	database: 'linque'
});

module.exports = pool;
