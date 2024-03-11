import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import buscarCodigoDeBarra from "../service/webScrapingService";

const productosRouter = Router();

productosRouter.post('/productos', async (req: Request, res: Response) => {
  try {
    const {codigo} = req.body;
    const producto:Producto = await buscarCodigoDeBarra(codigo);
    res.json(producto);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({error:'error'})
  }
});

export default productosRouter;