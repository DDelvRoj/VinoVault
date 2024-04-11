import {types } from "cassandra-driver";

export interface Usuario {
    id_usuario?:types.Uuid,
    nombre?:string,
    usuario?:string, 
    clave?:string,
    admin?:boolean,
    creado?:boolean
}