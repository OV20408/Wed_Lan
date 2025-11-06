-- PostgreSQL version
CREATE TABLE IF NOT EXISTS rsvp (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR(200) NOT NULL,
	asiste BOOLEAN NOT NULL,
	cantidad_personas INTEGER NULL, 
	nombres_acompanantes_mayor TEXT NULL,
	nombres_acompanantes_menor TEXT NULL,
	cantidad_ninos INTEGER NULL,    
	cantidad_adultos INTEGER NULL,  
	celular VARCHAR(50) NOT NULL,
	mensaje TEXT NOT NULL,
	fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
