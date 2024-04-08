import { Router, Request, Response } from "express";
import { visorSesion } from "../util/sesionUtil";
import bcryptUtil from "../util/bcryptUtil";
import { UsuarioService } from "../service/usuarioService";
import { firmarToken } from "../util/tokenUtil";
import { Credential } from "../type";
import { ConexionDataBase } from "../model/conexionBD";

const loginRouter = Router();

loginRouter.post('/login', async (req: Request, res: Response) => {
    const {username,password} = req.body;
    console.log({username,password});
    
    const conexion:ConexionDataBase = new ConexionDataBase(visorSesion);
    const usuarioBuscador:UsuarioService = new UsuarioService(conexion);
    try {
      await conexion.conectar();
      const user = await usuarioBuscador.coindicenDatos({usuario:username, clave:password});
      if(!user){
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      
      

      // Generar y enviar el token JWT
      const token = firmarToken(user);
      console.log("Inicio de sesión LOGIN éxitoso...");
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
    }
    await conexion.desconectar();
  });

export default loginRouter;