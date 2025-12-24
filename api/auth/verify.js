const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambialo-en-produccion';

// GET /api/auth/verify - Verificar si el token es válido
async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Obtener token del header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const token = authHeader.substring(7); // Remover "Bearer "

      try {
        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        return res.status(200).json({
          valid: true,
          user: {
            id: decoded.id,
            username: decoded.username
          }
        });
      } catch (error) {
        return res.status(401).json({ 
          valid: false, 
          error: 'Token inválido o expirado' 
        });
      }
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/auth/verify:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = handler;

