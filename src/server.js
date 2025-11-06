require('dotenv').config();
const express = require('express');
const cors = require('cors');

const rsvpRouter = require('./routes/rsvp');
const { pool } = require('./db/sql');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.json({ status: 'ok', message: 'API Invitación Boda' });
});

app.use('/api/rsvp', rsvpRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
	console.log(`Servidor escuchando en puerto ${PORT}`);
	// Verificar conexión a la base de datos
	try {
		await pool.query('SELECT NOW()');
		console.log('✅ Conectado a PostgreSQL exitosamente');
	} catch (error) {
		console.error('❌ Error conectando a la base de datos:', error.message);
	}
});

