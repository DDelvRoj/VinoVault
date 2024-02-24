import { Router, Request, Response } from "express";
import { UsuarioModel } from "../model/usuarioModel";
import { visorSesion } from "../util/sesionUtil";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const SECRET_KEY: string | undefined = process.env.CLAVE_FIRMA;

const router = Router();


router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const cliente:UsuarioModel = new UsuarioModel(visorSesion);
    try {
        await cliente.conectar();
        const user = await cliente.obtenerUsuarioPorUsername(username);
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
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
    }
    await cliente.desconectar();
  });