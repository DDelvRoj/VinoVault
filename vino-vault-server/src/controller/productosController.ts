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
import { borrarImagen, buscarImagen, guardarImagen } from "../util/imagenesUtil";

const productosRouter = Router();

productosRouter.get('/productos/:id',authenticateToken, async(req:Request, res:Response)=>{

  const producto:Producto = new Producto({id_producto:req.params['id']});
  const conexion:ConexionDataBase = getConexionCargada(req);

  try {  

    await conexion.conectar();
    const resultado = await new ProductoService(conexion).buscarProducto(producto);
    await conexion.desconectar();

    res.status(200).json(resultado);

  } catch (error) {

    console.log(error);
    res.status(500).json({error:error});
    
  }
});
productosRouter.put('/productos', authenticateToken, async(req:Request, res:Response)=>{

  const productoMod:ProductoInterface = req.body as ProductoInterface;
  const conexion:ConexionDataBase = getConexionCargada(req);

  try {
    
    const productoService:ProductoService = new ProductoService(conexion);
    await conexion.conectar();
    const producto:Producto = new Producto(productoMod);
    
    if(!productoMod.id_producto){

      await conexion.desconectar();
      res.status(401).json({error:'El producto posee parametros inválidos.'});

    }
    if(productoMod.imagen){

      guardarImagen(productoMod.imagen,productoMod.id_producto);

    }

    await productoService.modificarProducto(producto);
    await conexion.desconectar();

    res.status(201).json({msj:'Modificación exitosa.'});

  } catch (error) {

    res.status(500).json({error:`Error al modificar el producto: ${error}`})

  }
})

productosRouter.post('/productos',authenticateToken, async(req:Request, res:Response)=>{

  const conexion:ConexionDataBase = getConexionCargada(req);
  const productoService:ProductoService = new ProductoService(conexion);
  const productoInsertable:ProductoInterface = req.body as ProductoInterface;

  try {
    
    await conexion.conectar();
    const producto: Producto = new Producto(productoInsertable);
    console.log(productoInsertable.imagen.substring(0,20));
    
    if(productoInsertable.imagen){
      borrarImagen(productoInsertable.ean);
      guardarImagen(productoInsertable.imagen,productoInsertable.ean);
    }

    await productoService.crearProducto(producto);
    
    res.status(201).json({estado:'Inserción exitosa.'})
  } catch (error) {
    console.log(error);
    res.status(500).json({error:`Error al insertar los productos: ${error}`})
  } finally {
    await conexion.desconectar();
  }
})

productosRouter.get('/productos/listar/todos',authenticateToken, async(req:Request, res:Response)=>{

  const conexion:ConexionDataBase = getConexionCargada(req);

  try {
    
    await conexion.conectar();
    let resultado = (await new ProductoService(conexion).listarProductos() as Producto[]);
    
    for (const r of resultado) {
      const id = r.id_producto.toString();
      const ean = r.ean;
      try {

        const imagenEan = await buscarImagen(ean);
        const imagenId = await buscarImagen(id);

        if(imagenId){
          r.imagen = imagenId;
        } else if(imagenEan){
          r.imagen = imagenEan;
          guardarImagen(imagenEan,id);
          borrarImagen(ean);
        }

      } catch (error) {
        console.error('Error al buscar y convertir la imagen:', error);
      }
    }

    const productoDataLength:string = Buffer.byteLength(JSON.stringify(resultado),'utf-8').toString();

    res.appendHeader('Content-Length',productoDataLength);

    res.status(200).json(resultado);

  } catch (error) {
    console.log(error);
    res.status(500).json({error:error});
  } finally {
    await conexion.desconectar();
  }
})

productosRouter.get('/productos/codigo/:id', authenticateToken, ultimosCambios(1000000), async (req: Request, res: Response) => {

  const conexion: ConexionDataBase = getConexionCargada(req);
  const codigo = req.params.id;
  const productoServ: ProductoService = new ProductoService(conexion);
  const productoTempServ: ProductoTempService = new ProductoTempService(conexion);

  const buscarProducto = async (): Promise<ProductoInterface | ProductoTemp | null> => {

    try {

      await conexion.conectar();
      
      let resultado: ProductoInterface | ProductoTemp | undefined = await productoServ.buscarProducto(new Producto({ ean: codigo }));

      if (!resultado) {
        resultado = await productoTempServ.buscarProducto(new ProductoTemp({ ean: codigo }));
        if (resultado?.imagen) {
          guardarImagen(resultado.imagen, resultado.ean);
        }
        if (!resultado) {
          resultado = await buscarCodigoDeBarra(codigo);
          await productoTempServ.crearProducto(new ProductoTemp(resultado));
        }
      }

      return resultado ?? null;
      
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      throw error;
    }
  };

  try {
    const resultado = await buscarProducto();

    if (resultado) {
      const productoDataLength = Buffer.byteLength(JSON.stringify(resultado), 'utf-8').toString();
      res.setHeader('Content-Length', productoDataLength);
      res.json(resultado);
    } else {
      res.status(404).json({
        error: 'No logramos encontrar el producto requerido en ninguna base de datos. Cabe la posibilidad de que el producto buscado haya caído en falsificación, no tiene documentos en orden, o simplemente no exista. En todo caso recomendamos ingresar el producto manualmente.'
      });
    }
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: `Error al obtener el producto: ${error}` });
  } finally {
    await conexion.desconectar();
  }
});


export default productosRouter;