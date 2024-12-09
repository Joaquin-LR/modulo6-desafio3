import pkg from 'pg'; // (DESDE AQUÍ EL REQ 2)
const { Pool } = pkg; // (Necesario pq trabajo con module) 

import express from 'express';
import cors from 'cors';

// Configuración base de datos likeme
const pool = new Pool({
  host: 'localhost',
  user: '', // COMPLETAR CON USUARIO POSTGRES
  password: '', // COMPLETAR CON PASSWORD POSTGRESS
  database: 'likeme',
  allowExitOnIdle: true,
});

// Inicializar la aplicación
const app = express();
const PORT = 3000; // Puerto 3000 como se pide

// Middlewares
app.use(cors()); // Habilitar CORS (REQ 1)
app.use(express.json()); // Parsear JSON

// Ruta GET para obtener todos los posts (REQ 3)
app.get('/posts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});

// Ruta POST para agregar nuevos posts (REQ 4)
app.post('/posts', async (req, res) => {
  const { titulo, url, descripcion } = req.body;
  try {
    const consulta = 'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4)'; // De aquí a la línea 40 evito SQL Injection (Ej: DROP TABLE posts)
    const values = [titulo, url, descripcion, 0]; // Por defecto, los likes comienzan en 0 
    await pool.query(consulta, values);
    res.status(201).send('Post agregado con éxito');
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el post' });
  }
});

// Iniciar el server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
