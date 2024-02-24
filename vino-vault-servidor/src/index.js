const express = require('express');
const { Client } = require('cassandra-driver');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const visor = {body:{username:"visor", password: "visor"}};
const SECRET_KEY = process.env.CLAVE_FIRMA // Clave secreta para firmar JWT

// Permite crear un objeto de sesion para Cassandra
const crearSesion = (req) =>{
  const { username, password } = req.body;
  console.log(`Objecto Cliente ${username} creado.`);
  return new Client({
    contactPoints: ['127.0.0.1'], // Puedes cambiar esto a tus contact points
    localDataCenter: 'datacenter1',
    credentials: { username: username, password: password },
    keyspace: 'mykeyspace' // Asegúrate de cambiar esto al nombre de tu keyspace
  });
}

// Conexión a Cassandra
const conectar = async (cliente)=>{
  await cliente.connect()
  .then(() =>{
    console.log('Conexión exitosa a Cassandra');
    return false;
  })
  .catch(err =>{
    console.error('Error al conectar a Cassandra', err);
    return true;
  });
}
// Cerrar conexión a Cassandra
const apagar = async (cliente)=>{
  await cliente.shutdown().then(()=>{
    console.log("Sesión cerrada.");
  })
  .catch(err =>{
    console.error("Error al cerrar la sesión ", err);
  })
}

const login =  async (client, username) => {
  try {
    if(await !conectar(client))return;
      console.log("Buscando usuario...");
      // Obtener el usuario de la base de datos
      const result = await client.execute('SELECT * FROM users WHERE username = ?', [username]);
      const user = result.first();
    if (!user)return null;
    return user;
  } catch (error) {
    console.error('Ocurrió un error al buscar al usuario ', err);
  }
}

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use(cors());

// Ruta de registro de usuario
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const client = await crearSesion(visor);
  try {
    if(await !conectar(client)) return;
    
    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await  client.execute('SELECT * FROM users WHERE username = ?', [username]);
    console.log("Buscando usuario...");
    if (existingUser.rowLength > 0) {
      const error = { error: 'El usuario ya existe' };
      console.log(error);
      return res.status(400).json(error);
    }
    console.log("Creando usuario...");
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    await client.execute('INSERT INTO users (username, password, creado) VALUES (?, ?, ?)', [username, hashedPassword, false]);
    await apagar(client);
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error('Error al registrar usuario en Cassandra', err);
    await apagar(client);
    res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
  }
});

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const client = await crearSesion(visor);
  try {

    const user = await login(client, username);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar y enviar el token JWT
    const token = jwt.sign({ username: user.username }, SECRET_KEY);
    console.log("Inicio de sesión éxitoso...");
    await apagar(client);
    res.json({ token });
  } catch (err) {
    await apagar(client);
    console.error('Error al iniciar sesión en Cassandra', err);
    res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
  }
});




// Middleware para autenticación con JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({ error: 'Token de autenticación requerido' });
    }
  
    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Token de autenticación inválido' });
      }
  
      req.user = decoded; // Los datos del usuario decodificados se adjuntan a req.user
      console.log(decoded);
      next();
    });
  }
  

// Ruta protegida que requiere autenticación
app.get('/protected', authenticateToken, async (req, res) => {
    try {
      const query = 'SELECT * FROM employees'; // Cambia esto al nombre de tu tabla de empleados
      const result = await client.execute(query);
      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtener empleados desde Cassandra', err);
      res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
    }
  });

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
