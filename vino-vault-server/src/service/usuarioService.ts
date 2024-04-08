import { ConexionDataBase } from "../model/conexionBD";
import { UsuarioModel } from "../model/usuarioModel";
import { Usuario } from "../type";
import bcryptUtil from "../util/bcryptUtil";
import { transformarTexto } from "../util/trasformarTextoUtil";

export class UsuarioService {
    
    private usuario:UsuarioModel;

    constructor(conexion:ConexionDataBase){
        this.usuario = new UsuarioModel(conexion, this);
    }

    async buscarUsuario (usuario:Usuario)  {
        try {
            const usuarioValor = await this.usuario.buscar(usuario);
            return usuarioValor;
        } catch (error) {
            throw error;
        }
    }

    
    async coindicenDatos (nombre:Usuario)  {
        try {
            const usuarios:Usuario[] = await this.usuario.listar();
            const usuario:Usuario = await usuarios.map(async u => {
                const usuarioValidacion = await bcryptUtil.desencriptarYCompararData(transformarTexto(nombre.usuario), u.usuario);
                const claveValidacion = await bcryptUtil.desencriptarYCompararData(transformarTexto(nombre.clave),u.clave);   
                if(usuarioValidacion && claveValidacion){
                    return u;
                }
            })[0];
            if(usuario){
                return usuario;
            }
        } catch (error) {
            throw error;
        }
    }
    async crearUsuario(usuarioNuevo:Usuario) {
        try {
            await this.usuario.insertar(usuarioNuevo);
        } catch (error) {
            throw error;
        }
    }

    async validarUsuario(usuarioValidable:Usuario){
        try {
           await this.usuario.validarUsuarios(usuarioValidable);
        } catch (error) {
            throw error;
        }
    }
}

