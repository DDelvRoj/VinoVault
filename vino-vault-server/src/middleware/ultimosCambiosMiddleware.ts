import { Request, Response, NextFunction } from "express";

export function ultimosCambios(tiempoQueDebeDurar: number) {
    return (req: Request, res: Response, next: NextFunction) => {
        const fechaActual: Date = new Date();
        const fueModificadoStr: string | undefined = req.header('If-Modified-Since');
        
        if (fueModificadoStr) {
            const fueModificado: Date = new Date(fueModificadoStr);
            const esNecesarioActualizar: boolean = (fechaActual.getTime() - fueModificado.getTime()) > tiempoQueDebeDurar;
            
            if (!esNecesarioActualizar) {
                res.sendStatus(304);
                return; // Importante: terminar la ejecución de la función middleware aquí
            }
        }
        
        res.setHeader('Last-Modified', fechaActual.toUTCString());
        next();
    };
}
