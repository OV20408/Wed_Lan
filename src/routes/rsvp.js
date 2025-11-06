const express = require('express');
const { query } = require('../db/sql');

const router = express.Router();

function validateRsvpBody(body) {
	const errors = [];
	
	// Campos obligatorios
	if (!body.nombre || typeof body.nombre !== 'string') errors.push('nombre es requerido');
	if (typeof body.asiste !== 'boolean') errors.push('asiste debe ser boolean');
	if (!body.celular || typeof body.celular !== 'string') errors.push('celular es requerido');
	
	// Campos opcionales con validación condicional
	if (body.cantidad_personas !== undefined && body.cantidad_personas !== null) {
		if (typeof body.cantidad_personas !== 'number' || body.cantidad_personas < 0) {
			errors.push('cantidad_personas debe ser un número ≥ 0');
		}
	}
	
	if (body.nombres_acompanantes_mayor !== undefined && body.nombres_acompanantes_mayor !== null) {
		if (!Array.isArray(body.nombres_acompanantes_mayor)) {
			errors.push('nombres_acompanantes_mayor debe ser array de strings');
		}
	}
	
	if (body.nombres_acompanantes_menor !== undefined && body.nombres_acompanantes_menor !== null) {
		if (!Array.isArray(body.nombres_acompanantes_menor)) {
			errors.push('nombres_acompanantes_menor debe ser array de strings');
		}
	}
	
	if (body.cantidad_ninos !== undefined && body.cantidad_ninos !== null) {
		if (typeof body.cantidad_ninos !== 'number' || body.cantidad_ninos < 0) {
			errors.push('cantidad_ninos debe ser un número ≥ 0');
		}
	}
	
	if (body.cantidad_adultos !== undefined && body.cantidad_adultos !== null) {
		if (typeof body.cantidad_adultos !== 'number' || body.cantidad_adultos < 0) {
			errors.push('cantidad_adultos debe ser un número ≥ 0');
		}
	}
	
	if (body.mensaje !== undefined && body.mensaje !== null) {
		if (typeof body.mensaje !== 'string') {
			errors.push('mensaje debe ser string');
		}
	}
	
	return errors;
}

router.post('/', async (req, res) => {
	try {
		const body = req.body;
		const errors = validateRsvpBody(body);
		if (errors.length) return res.status(400).json({ errors });

		const nombresAcompanantesMayorJson = body.nombres_acompanantes_mayor ? JSON.stringify(body.nombres_acompanantes_mayor) : null;
		const nombresAcompanantesMenorJson = body.nombres_acompanantes_menor ? JSON.stringify(body.nombres_acompanantes_menor) : null;

		const result = await query(
			`INSERT INTO rsvp (
				nombre,
				asiste,
				cantidad_personas,
				nombres_acompanantes_mayor,
				nombres_acompanantes_menor,
				cantidad_ninos,
				cantidad_adultos,
				celular,
				mensaje
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
			[
				body.nombre,
				body.asiste,
				body.cantidad_personas || null,
				nombresAcompanantesMayorJson,
				nombresAcompanantesMenorJson,
				body.cantidad_ninos || null,
				body.cantidad_adultos || null,
				body.celular,
				body.mensaje || null
			]
		);

		return res.status(201).json({ id: result.rows[0].id });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Error al crear RSVP' });
	}
});

router.get('/', async (req, res) => {
	try {
		const result = await query('SELECT * FROM rsvp ORDER BY id DESC LIMIT 500');
		const data = result.rows.map((row) => ({
			...row,
			nombres_acompanantes_mayor: (() => {
				if (!row.nombres_acompanantes_mayor) return null;
				try { return JSON.parse(row.nombres_acompanantes_mayor); } catch { return null; }
			})(),
			nombres_acompanantes_menor: (() => {
				if (!row.nombres_acompanantes_menor) return null;
				try { return JSON.parse(row.nombres_acompanantes_menor); } catch { return null; }
			})()
		}));
		return res.json(data);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Error al listar RSVPs' });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const id = Number(req.params.id);
		if (Number.isNaN(id)) return res.status(400).json({ error: 'id inválido' });
		const result = await query('SELECT * FROM rsvp WHERE id = $1', [id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
		const row = result.rows[0];
		row.nombres_acompanantes_mayor = (() => { 
			if (!row.nombres_acompanantes_mayor) return null;
			try { return JSON.parse(row.nombres_acompanantes_mayor); } catch { return null; } 
		})();
		row.nombres_acompanantes_menor = (() => { 
			if (!row.nombres_acompanantes_menor) return null;
			try { return JSON.parse(row.nombres_acompanantes_menor); } catch { return null; } 
		})();
		return res.json(row);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Error al obtener RSVP' });
	}
});

module.exports = router;

