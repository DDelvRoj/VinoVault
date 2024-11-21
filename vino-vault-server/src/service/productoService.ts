import { manejarErrores } from '../decorator';
import { Producto } from '../entity/producto';
import { Producto as ProductoType } from '../type';
import { ConexionDataBase } from '../model/conexionBD';
import { QueryExecuterModel } from '../model/queryExecuterModel';
export class ProductoService {
    
    private queryExecuter: QueryExecuterModel;
    
    constructor(conexion:ConexionDataBase){
        this.queryExecuter = new QueryExecuterModel(conexion);
    }

    @manejarErrores
    async listarProductos(){
        return await this.queryExecuter.listar(new Producto());
    }

    @manejarErrores
    async buscarProducto(item:Producto){
        return await this.queryExecuter.buscar(item) as ProductoType;
    }

    @manejarErrores
    async crearProducto(item:Producto){
        await this.queryExecuter.insertar(item);
    }

    @manejarErrores
    async modificarProducto(modificar:Producto){
        await this.queryExecuter.modificar(modificar);
    }

}