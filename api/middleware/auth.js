// Helper para verificar autenticación en funciones serverless
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambialo-en-produccion';

function verifyToken(req) {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false, error: 'No autorizado. Token requerido.' };
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    try {
      // Verificar token
      const decoded = jwt.verify(token, JWT_SECRET);
      return { valid: true, user: decoded };
    } catch (error) {
      return { valid: false, error: 'Token inválido o expirado' };
    }
  } catch (error) {
    return { valid: false, error: 'Error de autenticación' };
  }
}

module.exports = { verifyToken };
