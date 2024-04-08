import {types } from "cassandra-driver";

export interface Usuario {
    id_usuario?:types.Uuid,
    nombre?:string,
    usuario?:string, 
    clave?:string,
    rol?:string,
    creado?:boolean
}