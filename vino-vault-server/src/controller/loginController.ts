import { Router, Request, Response } from "express";
import { visorSesion } from "../util/sesionUtil";
import { UsuarioService } from "../service/usuarioService";
import { firmarToken } from "../util/tokenUtil";
import { Usuario as UsuarioInterface } from "../type";
import { ConexionDataBase } from "../model/conexionBD";
import { Usuario } from "../entity/usuario";

const loginRouter = Router();

loginRouter.post('/login', async (req: Request, res: Response) => {
    const {username,password} = req.body;
    console.log({username,password});
    
    const conexion:ConexionDataBase = new ConexionDataBase(visorSesion);
    const usuarioBuscador:UsuarioService = new UsuarioService(conexion);
    try {
      await conexion.conectar();
      const user = await usuarioBuscador.coindicenDatos(new Usuario({usuario:username, clave:password}));
    
      if(user===undefined ||user === null){
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      
      const resultado:UsuarioInterface = {
        id_usuario: user.id_usuario.toString(),
        usuario:user.usuario,
        clave:password,
        creado: user.creado
      };
      

      // Generar y enviar el token JWT
      const token = firmarToken(resultado);
      console.log("Inicio de sesión LOGIN éxitoso...");
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
    }
    await conexion.desconectar();
  });

export default loginRouter;