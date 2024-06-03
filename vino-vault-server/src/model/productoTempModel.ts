import { ProductoTemp } from "../type";
import { BaseModel } from "./baseModel";
import { ConexionDataBase } from "./conexionBD";

export class ProductoTempModel extends BaseModel<ProductoTemp>{
    constructor(conexion:ConexionDataBase){
        super("productos_temps",conexion);
    }
}