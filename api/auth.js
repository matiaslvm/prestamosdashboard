const { dbGet } = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambialo-en-produccion';

// POST /api/auth/login
async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { username, password } = body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
      }

      // Buscar usuario en la base de datos
      const supabase = require('./db').getSupabase();
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !usuario) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }

      // Verificar contraseña
      const passwordMatch = await bcrypt.compare(password, usuario.password_hash);
      
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }

      // Generar token JWT
      const token = jwt.sign(
        { 
          id: usuario.id, 
          username: usuario.username 
        },
        JWT_SECRET,
        { expiresIn: '7d' } // Token válido por 7 días
      );

      return res.status(200).json({
        success: true,
        token: token,
        user: {
          id: usuario.id,
          username: usuario.username
        }
      });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/auth/login:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = handler;

