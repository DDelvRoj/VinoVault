import { Producto } from "../type";
import { BaseModel } from "./baseModel";
import { ConexionDataBase } from "./conexionBD";

export class ProductoModel extends BaseModel<Producto> {
    constructor(conexion:ConexionDataBase){
        super('productos', conexion);
    }
}