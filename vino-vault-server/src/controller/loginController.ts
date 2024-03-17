import { Router, Request, Response } from "express";
import { visorSesion } from "../util/sesionUtil";
import bcryptUtil from "../util/bcryptUtil";
import { UsuarioService } from "../service/usuarioService";
import { firmarToken } from "../util/tokenUtil";
import { Credential } from "../type";

const loginRouter = Router();

loginRouter.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const usuarioBuscador:UsuarioService = new UsuarioService(visorSesion);
    try {
      await usuarioBuscador.conectar();
      const user = await usuarioBuscador.buscarUsuarioPorNombre(username);
      if(!user){
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      // Verificar la contraseña
      const passwordMatch = await bcryptUtil.desencriptarYCompararPassword(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const credenciales:Credential = {
        username: username,
        password: user.password
      }

      // Generar y enviar el token JWT
      const token = firmarToken(credenciales);
      console.log("Inicio de sesión LOGIN éxitoso...");
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
    }
    usuarioBuscador.desconectar();
  });

export default loginRouter;