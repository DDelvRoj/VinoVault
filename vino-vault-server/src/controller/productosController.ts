import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import buscarCodigoDeBarra from "../service/webScrapingService";
import { Producto as ProductoInterface } from '../type'
import { ultimosCambios } from "../middleware/ultimosCambiosMiddleware";
import { ConexionDataBase } from "../model/conexionBD";
import { ProductoService } from '../service/productoService';
import { ProductoTempService } from "../service/productoTempService";
import { Producto } from "../entity/producto";
import { ProductoTemp } from "../entity/productoTemp";
import { getConexionCargada } from "../util/conexionUtil";
import { buscarImagen } from "../util/imagenesUtil";

const productosRouter = Router();

productosRouter.get('/productos/:id',authenticateToken, async(req:Request, res:Response)=>{
  try {  
    const producto:Producto = new Producto({id_producto:req.params['id']});
    const conexion:ConexionDataBase = getConexionCargada(req);
    await conexion.conectar();
    const resultado = await new ProductoService(conexion).buscarProducto(producto);
    await conexion.desconectar();
    res.json(resultado);
  } catch (error) {
    console.log(error);
    res.status(500).json({error:error})
  }
});
productosRouter.put('/productos', authenticateToken, async(req:Request, res:Response)=>{
  try {
    const productoMod:ProductoInterface = req.body.producto as ProductoInterface;
    const conexion:ConexionDataBase = getConexionCargada(req);
    const productoService:ProductoService = new ProductoService(conexion);
    await conexion.conectar();
    const producto:Producto = new Producto(productoMod);
    if(!productoMod.id_producto){
      await conexion.desconectar();
      res.status(401).json({error:'El producto posee parametros inválidos.'})
    }
    await productoService.modificarProducto(producto);
    await conexion.desconectar();
    res.status(201).json({estado:'Modificación exitosa.'})
  } catch (error) {
    res.status(500).json({error:`Error al modificar el producto: ${error}`})
  }
})

productosRouter.post('/productos',authenticateToken, async(req:Request, res:Response)=>{
  try {
    const conexion:ConexionDataBase = getConexionCargada(req);
    const productoService:ProductoService = new ProductoService(conexion);
    const productoInsertable:ProductoInterface = req.body.producto as ProductoInterface;
    await conexion.conectar();
    const producto: Producto = new Producto(productoInsertable);
    console.log(producto);  
    await productoService.crearProducto(producto);
    await conexion.desconectar();
    res.status(201).json({estado:'Inserción exitosa.'})
  } catch (error) {
    console.log(error);
    res.status(500).json({error:`Error al insertar los productos: ${error}`})
  }
})

productosRouter.get('/productos/listar/todos',authenticateToken, async(req:Request, res:Response)=>{
  try {
    const conexion:ConexionDataBase = getConexionCargada(req);
    await conexion.conectar();
    let resultado = (await new ProductoService(conexion).listarProductos() as Producto[]);
    await conexion.desconectar();
    for (const r of resultado) {
      const ean = r.ean;
      try {
        const imagen = await buscarImagen(ean);
        if (imagen) {
          const preImagen = r.imagen;
          r.imagen = imagen;
          const postImagen = r.imagen;
          console.log(`${preImagen?.length} y ${postImagen.length}`);
        }
      } catch (error) {
        console.error('Error al buscar y convertir la imagen:', error);
      }
    }
    resultado.forEach(r=>console.log(r));
    const productoDataLength:string = Buffer.byteLength(JSON.stringify(resultado),'utf-8').toString();
    res.appendHeader('Content-Length',productoDataLength);
    res.json(resultado);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({error:error});
  }
})

// Falta middleware de acceso
productosRouter.get('/productos', authenticateToken, ultimosCambios(1000000),
async (req: Request, res: Response) => {
  try {
    const conexion:ConexionDataBase = getConexionCargada(req);
    const productoServ: ProductoService = new ProductoService(conexion);
    const productoTempServ: ProductoTempService = new ProductoTempService(conexion);
    const codigo = req.query.codigo.toString();
  
    const buscarProducto = async (): Promise<ProductoInterface | ProductoTemp> => {
    try {
        // Conectar a la base de datos
        await conexion.conectar();
        // Buscar el producto en la tabla principal CAMBIAR
        let resultado: ProductoInterface | ProductoTemp | undefined = await productoServ.buscarProducto(new Producto({ ean: codigo }));
        // Si no se encuentra en la tabla principal, buscar en la tabla temporal
        if (resultado === undefined || resultado === null) {
          //CAMBIAR
            resultado = await productoTempServ.buscarProducto(new ProductoTemp({ ean: codigo }));
            if(resultado === undefined || resultado === null) {
              resultado = await buscarCodigoDeBarra(codigo);
              await productoTempServ.crearProducto(new ProductoTemp(resultado));
            }
        }
        // Retornar el resultado
        return resultado !== undefined ? resultado : null;
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la ejecución
        console.error('Error al obtener el producto:', error);
        throw error;
    }
  };
  // Para usar el valor devuelto por la función asíncrona, debes llamarla y esperar su resultado
  const producto = await buscarProducto().then(resultado => {
      return resultado;
  }).catch(error => {
      console.error('Error al obtener el producto:', error);
      res.status(404).json({error:'No logramos encontrar el producto requerido en ninguna base de datos, '+
      'cabe la posibilidad de que el producto buscado haya caído en falsificación, '+
      'no tiene documentos en órden, o simplemente no exista. En todo caso recomendamos ingresar el producto '+
      'manualmente.'
    })
  });
  
    const productoDataLength:string = Buffer.byteLength(JSON.stringify(producto),'utf-8').toString();
    res.appendHeader('Content-Length',productoDataLength);
    res.json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).json({error:`Error al obtener el producto: ${error}`});
  }
});

export default productosRouter;