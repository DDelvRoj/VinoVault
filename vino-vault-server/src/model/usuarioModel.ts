import { ConexionDataBase } from "./conexionBD";
import { Usuario } from '../type/usuario.interface';
import { BaseModel } from "./baseModel";
import { UsuarioService } from '../service/usuarioService';
import { transformarTexto } from "../util/trasformarTextoUtil";


export class UsuarioModel extends BaseModel<Usuario> {

  private usuarioService:UsuarioService;

  constructor(conexion:ConexionDataBase, usuarioService:UsuarioService) {
    super('usuarios', conexion);
    this.usuarioService = usuarioService;
  }

  async validarUsuarios (usuario:Usuario) {
    try {
      const usuarioValidableBuscado: Usuario = await this.usuarioService.coindicenDatos(usuario);
      let usuarioValidableCopia:Usuario = Object.create(usuario);
      usuarioValidableCopia.creado=true;
      await this.modificar({id_usuario:usuario.id_usuario},usuarioValidableCopia);
      const query = `CREATE USER IF NOT EXISTS '${usuarioValidableBuscado.usuario}' WITH PASSWORD='${transformarTexto(usuarioValidableBuscado.clave)}'`;
      await this.conexion.getClient().execute(query,{prepared:true});
      
    } catch (error) {
      throw error;
    }
  }

  override async eliminar(item: Usuario): Promise<void> {
      try {
        const usuarioDescifrado:Usuario = await this.buscar({id_usuario:item.id_usuario});
        await super.eliminar(item);
         
      } catch (error) {
        throw error;
      }
  }
  
}