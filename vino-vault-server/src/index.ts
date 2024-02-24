import express, { Request, Response } from 'express';
import { Client } from 'cassandra-driver';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { authenticateToken } from './middleware/authMiddleware';
import { apagar, conectar, crearSesion, crearSesionVisor } from './service/cassandraService';

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const SECRET_KEY: string | undefined = process.env.CLAVE_FIRMA; // Clave secreta para firmar JWT

const login = async (client: Client, username: string): Promise<any> => {
  try {
    if (await conectar(client)) return;
    console.log("Buscando usuario...");
    // Obtener el usuario de la base de datos
    const result = await client.execute('SELECT * FROM users WHERE username = ?', [username]);
    const user = result.first();
    if (!user) return null;
    return user;
  } catch (error) {
    console.error('Ocurrió un error al buscar al usuario ', error);
  }
}

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use(cors());

// Ruta de registro de usuario
app.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const client = crearSesionVisor();
  try {
    if (await conectar(client)) return;

    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await client.execute('SELECT * FROM users WHERE username = ?', [username]);
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
app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const client = crearSesionVisor();
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
    const token = jwt.sign({ username: user.username }, SECRET_KEY || '');
    console.log("Inicio de sesión éxitoso...");
    await apagar(client);
    res.json({ token });
  } catch (err) {
    await apagar(client);
    console.error('Error al iniciar sesión en Cassandra', err);
    res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
  }
});

// Ruta protegida que requiere autenticación
app.get('/protected', authenticateToken, async (req: Request, res: Response) => {
  try {
    const query = 'SELECT * FROM employees'; // Cambia esto al nombre de tu tabla de empleados
    const client = crearSesionVisor();
    await conectar(client);
    const result = await client.execute(query);
    await apagar(client);
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
