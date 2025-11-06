require('dotenv').config();
const { Pool } = require('pg');

// Configuración de PostgreSQL
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

// Verificar conexión
pool.on('connect', () => {
	console.log('Conectado a la base de datos PostgreSQL');
});

pool.on('error', (err) => {
	console.error('Error inesperado en el cliente de PostgreSQL:', err);
});

async function query(queryText, params = []) {
	try {
		const result = await pool.query(queryText, params);
		return result;
	} catch (error) {
		console.error('Error ejecutando query:', error);
		throw error;
	}
}

module.exports = { query, pool };

