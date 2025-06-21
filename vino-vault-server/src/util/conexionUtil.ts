import { Request } from "express";
import { ConexionDataBase } from "../model/conexionBD";
import { transformarTexto } from "./transformarTextoUtil";

export const getConexionCargada = (req: Request): ConexionDataBase => {
    const user = (req as any).user;
    console.log('getConexionCargada req.user:', user);

    // Esto es solo para log o control
    const usernameTransformado = transformarTexto(user?.username || '');

    const conexion = new ConexionDataBase({
        username: String(process.env.CASSANDRA_USERNAME || ''),
        password: String(process.env.CASSANDRA_PASSWORD || '')
    });

    return conexion;
};
