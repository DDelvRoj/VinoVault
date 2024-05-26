import { Request } from "express";
import { ConexionDataBase } from "../model/conexionBD";
import { Usuario } from "../type";
import { transformarTexto } from "./transformarTextoUtil";

export const getConexionCargada = (req: Request): ConexionDataBase => {
  const usuario: Usuario = req['user'];
  usuario.clave = transformarTexto(usuario.clave);
  usuario.usuario = transformarTexto(usuario.usuario);
  const conexion: ConexionDataBase = new ConexionDataBase({ username: usuario.usuario, password: usuario.clave });
  console.log(usuario);
  return conexion;
};
