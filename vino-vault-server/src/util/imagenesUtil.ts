import path from "path";
import fs from 'fs';

const rutaOutput = '../../imagenes/';

export const guardarImagen = (imagen: any, nombre: string) => {
    const filePath = path.resolve(rutaOutput, `${nombre}.png`);
    const dir = path.dirname(filePath);
    console.log('La direccion', dir);
    
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, imagen);
    console.log(`Imagen guardada en: ${filePath}`);
}

export const buscarImagen = async (nombre: string): Promise<string | undefined> => {
    const imagePath = path.resolve(rutaOutput, `${nombre}.png`);
    console.log(imagePath);

    return new Promise((resolve) => {
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                console.log('No se encontró la imagen');
                resolve(undefined); // Devuelve undefined si hay un error
            } else {
                resolve(data.toString('base64')); // Devuelve los datos de la imagen si la lectura es exitosa
            }
        });
    });
}