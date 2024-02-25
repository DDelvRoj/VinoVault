import { UsuarioModel } from "../model/usuarioModel";
import { Credential } from "../type";

export class UsuarioService {

    usuario:UsuarioModel;

    constructor(usuarioExistenteCredential:Credential){
        this.usuario = new UsuarioModel(usuarioExistenteCredential);
    }

    async buscarUsuarioPorNombre (userName:string)  {
        try {
            const usuarioValor = await this.usuario.obtenerUsuarioPorUsername(userName);
            return usuarioValor;
        } catch (error) {
            throw error;
        }
    }

    async crearUsuario(usuarioNuevo:Credential) {
        try {
            await this.crearUsuario(usuarioNuevo);
        } catch (error) {
            throw error;
        }
    }

    async conectar(){
        try {
            await this.usuario.conectar();
        } catch (error) {
            throw error;   
        }
    }
    
    async desconectar(){
        try {
            await this.usuario.desconectar();
        } catch (error) {
            throw error;
        }
    }
}

