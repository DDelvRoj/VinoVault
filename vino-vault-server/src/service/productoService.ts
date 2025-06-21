import { manejarErrores } from '../decorator';
import { Producto } from '../entity/producto';
import { Producto as ProductoType } from '../type';
import { ConexionDataBase } from '../model/conexionBD';
import { QueryExecuterModel } from '../model/queryExecuterModel';

export class ProductoService {

    private queryExecuter: QueryExecuterModel;

    constructor(conexion: ConexionDataBase) {
        this.queryExecuter = new QueryExecuterModel(conexion);
    }

    @manejarErrores
    async listarProductos() {
        console.log('Iniciando listado de productos');
        const resultado = await this.queryExecuter.listar(new Producto());
        console.log('Productos listados:', resultado);
        return resultado;
    }

    @manejarErrores
    async buscarProducto(item: Producto) {
        console.log('Buscando producto con parámetros:', item);
        const resultado = await this.queryExecuter.buscar(item) as ProductoType;
        console.log('Producto encontrado:', resultado);
        return resultado;
    }

    @manejarErrores
    async crearProducto(item: Producto) {
        console.log('Creando nuevo producto:', item);
        await this.queryExecuter.insertar(item);
        console.log('Producto creado exitosamente');
    }

    @manejarErrores
    async modificarProducto(modificar: Producto) {
        console.log('Modificando producto con ID:', modificar.id_producto);
        await this.queryExecuter.modificar(modificar);
        console.log('Producto modificado exitosamente');
    }

    @manejarErrores
    async eliminarProducto(item: Producto) {
        console.log('Eliminando producto con ID:', item.id_producto);
        await this.queryExecuter.eliminar(item);
        console.log('Producto eliminado exitosamente');
    }
}
