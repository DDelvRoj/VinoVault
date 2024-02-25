import { UsuarioModel } from "../model/usuarioModel";
import { Credential } from "../type";

export class UsuarioService {

    usuario:UsuarioModel;

    constructor(usuarioExistenteCredential:Credential){
        this.usuario = new UsuarioModel(usuarioExistenteCredential);
    }

    async buscarUsuarioPorNombre (userName:string)  {
        try {
            await this.usuario.conectar();
            const usuarioValor = await this.usuario.obtenerUsuarioPorUsername(userName);
            await this.usuario.desconectar();
            return usuarioValor;
        } catch (error) {
            throw error;
        }
    }

    async crearUsuario(usuarioNuevo:Credential) {
        try {
            await this.usuario.conectar();
            await this.crearUsuario(usuarioNuevo);
            await this.usuario.desconectar();
        } catch (error) {
            throw error;
        }
    }
}

