// Script para crear usuario inicial
// Ejecuta: node supabase/create-user.js

const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser(username, password) {
  try {
    // Generar hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Insertar usuario
    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        username: username,
        password_hash: passwordHash
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        console.log(`⚠️  El usuario "${username}" ya existe`);
        return;
      }
      throw error;
    }

    console.log(`✅ Usuario "${username}" creado exitosamente`);
    console.log(`   Hash: ${passwordHash}`);
  } catch (error) {
    console.error('❌ Error creando usuario:', error.message);
  }
}

// Crear usuario por defecto
const username = process.argv[2] || 'admin';
const password = process.argv[3] || 'admin123';

console.log(`🔐 Creando usuario: ${username}`);
createUser(username, password).then(() => {
  console.log('\n✅ Proceso completado');
  console.log(`\n📝 Credenciales por defecto:`);
  console.log(`   Usuario: ${username}`);
  console.log(`   Contraseña: ${password}`);
  console.log(`\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login`);
  process.exit(0);
});

