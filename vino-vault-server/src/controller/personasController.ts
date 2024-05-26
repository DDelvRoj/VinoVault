import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { ConexionDataBase } from '../model/conexionBD';
import { visorSesion } from "../util/sesionUtil";
import { UsuarioService } from '../service/usuarioService';
import { Usuario } from "../entity/usuario";
import { getConexionCargada } from "../util/conexionUtil";

const personasRouter:Router = Router();

personasRouter.get('/personas', authenticateToken, async (req:Request, res:Response)=>{
    const conexion:ConexionDataBase = getConexionCargada(req);
    const usuarioService:UsuarioService = new UsuarioService(conexion);
    try {
        await conexion.conectar();
        const resultado = (await usuarioService.listarUsuario());
        console.log(resultado);
        
        await conexion.desconectar();
        res.status(201).json(resultado)
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Error'})
    }
})

personasRouter.post('/personas/validar/:id',authenticateToken , async (req:Request, res:Response)=>{
    const usuarioMod:Usuario = new Usuario({id_usuario:req.params['id']});
    let conexion:ConexionDataBase = new ConexionDataBase(visorSesion);
    try {
        await conexion.conectar();
        const usuarioBusqueda:Usuario = await (new UsuarioService(conexion)).buscarUsuario(usuarioMod);
        if(usuarioBusqueda === undefined || usuarioBusqueda === null){
            res.status(401).json({error:'El usuario no está registrado en la base de datos.'})
        }
        
        await conexion.desconectar();
        conexion = getConexionCargada(req);
        await conexion.conectar();
        //await (new UsuarioService(conexion)).crearUsuario(usuarioBusqueda);
        usuarioBusqueda.creado=true;
        usuarioBusqueda.pseudoclave=null;
        console.log(usuarioBusqueda);
        
        await (new UsuarioService(conexion)).modificarUsuario(new Usuario(usuarioBusqueda));
        
        res.status(201).json({message:'Validación Éxitosa...'});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Error'})
    }  
})

export default personasRouter;