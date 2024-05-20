import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { Credential, Usuario as Us } from "../type";
import { ConexionDataBase } from '../model/conexionBD';
import { visorSesion } from "../util/sesionUtil";
import { UsuarioService } from '../service/usuarioService';
import { Usuario } from "../entity/usuario";
import { transformarTexto } from "../util/transformarTextoUtil";

const personasRouter:Router = Router();

personasRouter.get('/personas', authenticateToken, async (req:Request, res:Response)=>{
    console.log('Invocao');
    
    const usuario:Us = req['user'];
    const conexion:ConexionDataBase = new ConexionDataBase(crearCredencial(usuario));
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

personasRouter.put('/personas',authenticateToken , async (req:Request, res:Response)=>{
    const usuario:Us = req['user'];
    const usuarioMod:Usuario = new Usuario();
    usuarioMod['set'] = req.body.usuario;
    let conexion:ConexionDataBase = new ConexionDataBase(visorSesion);
    try {
        await conexion.conectar();
        const usuarioBusqueda:Usuario = await (new UsuarioService(conexion)).buscarUsuario(usuarioMod);
        if(usuarioBusqueda === undefined || usuarioBusqueda === null){
            res.status(401).json({error:'El usuario no está registrado en la base de datos.'})
        }
        usuarioMod.creado=true;
        usuarioBusqueda['set'] = usuarioMod['get'];
        await conexion.desconectar();
        conexion = new ConexionDataBase(crearCredencial(usuario));
        await conexion.conectar();
        await (new UsuarioService(conexion)).modificarUsuario(new Usuario(usuarioBusqueda));
        await (new UsuarioService(conexion)).crearUsuario(usuarioMod);
        res.status(201).json({message:'Validación Éxitosa...'});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Error'})
    }  
})


const crearCredencial = (datos:Us):Credential =>{
    return {username:transformarTexto(datos.usuario),password:transformarTexto(datos.clave)}
}

export default personasRouter;