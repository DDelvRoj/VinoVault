const bcrypt = require('bcrypt');

// La contraseña que quieres hashear
const password = 'admin123';

// Generar el hash
bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Error al generar el hash:', err);
  } else {
    console.log('Hash generado para "admin123":');
    console.log(hashedPassword); // Este es el hash generado
  }
});
