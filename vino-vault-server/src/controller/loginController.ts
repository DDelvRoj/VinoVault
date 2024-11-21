import { Router, Request, Response } from "express";
import { visorSesion } from "../util/sesionUtil";
import { UsuarioService } from "../service/usuarioService";
import { firmarToken } from "../util/tokenUtil";
import { Usuario as UsuarioInterface } from "../type";
import { ConexionDataBase } from "../model/conexionBD";
import { Usuario } from "../entity/usuario";
import { authenticateToken } from "../middleware/authMiddleware";

const loginRouter = Router();

loginRouter.get('/login', authenticateToken, async (req:Request, res:Response) => {

  const {id_usuario, usuario, admin} = req['user'];

  try {
    if(!id_usuario){
      res.status(401).json({error:'ID no encontrado.'})
    }

    res.status(200).json({id_usuario,usuario,admin});

  } catch (error) {
    res.status(500).json({error:'Error desconocido en el sector de ID.'})
  }


});

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
        admin:user.admin
      };
      
      const token = firmarToken(resultado);
      console.log("Inicio de sesión LOGIN éxitoso...");
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
    } finally {
      await conexion.desconectar();
    }
    
  });

export default loginRouter;