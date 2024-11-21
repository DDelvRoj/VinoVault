import { NextFunction,Request, Response } from "express";
import { UserAgent } from "express-useragent";

// Middleware para validar User-Agent para dispositivos móviles
const validarDispositivos = (req: Request, res: Response, next: NextFunction) => {
    const useragent = (new UserAgent()).parse(req.headers["user-agent"]);
    if(!(useragent.isAndroid || useragent.isWindows )){
      res.status(403).send('Dispositivo no autorizado');
    }
    next();
};

export default validarDispositivos;