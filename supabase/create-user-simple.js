// Script simplificado para crear usuario - NO requiere bcrypt
// Genera el hash usando crypto nativo de Node.js y luego puedes copiarlo a Supabase

const crypto = require('crypto');

// Función simple para generar un hash (no es bcrypt, pero funciona para desarrollo)
// Para producción, usa bcrypt real
function simpleHash(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// O mejor aún, genera un hash bcrypt usando un servicio online o directamente en Supabase
console.log('\n🔐 Para crear el usuario en Supabase:\n');
console.log('Opción 1: Usar este hash SHA256 (menos seguro, solo para desarrollo):');
console.log(`Usuario: admin`);
console.log(`Password Hash (SHA256): ${simpleHash('admin123')}\n`);

console.log('Opción 2 (RECOMENDADO): Generar hash bcrypt real');
console.log('Ve a: https://bcrypt-generator.com/');
console.log('Ingresa la contraseña: admin123');
console.log('Rounds: 10');
console.log('Copia el hash generado\n');

console.log('Opción 3: Crear directamente en Supabase Table Editor');
console.log('1. Ve a Supabase > Table Editor > usuarios');
console.log('2. Click "Insert row"');
console.log('3. Username: admin');
console.log('4. Password_hash: [pega el hash bcrypt]');
console.log('5. Guarda\n');

console.log('⚠️  NOTA: Para producción, usa bcrypt real, no SHA256\n');

