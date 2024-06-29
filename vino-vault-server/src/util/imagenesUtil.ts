import path from "path";
import fs from 'fs';

const rutaOutput = '../../imagenes/';
export const guardarImagen = (imagen, nombre) => {
    // Si la imagen es una cadena en base64, conviértela a un buffer
    if (typeof imagen === 'string') {
        if (imagen.startsWith('data:image/png;base64,')) {
            imagen = imagen.replace('data:image/png;base64,', '');
        }
        imagen = Buffer.from(imagen, 'base64');
    }

    const filePath = path.resolve(rutaOutput, `${nombre}.png`);
    const dir = path.dirname(filePath);

    console.log('La dirección', dir);

    // Crear el directorio si no existe
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Escribir la imagen en el archivo
    fs.writeFileSync(filePath, imagen);
    console.log(`Imagen guardada en: ${filePath}`);
}
export const buscarImagen = async (nombre: string): Promise<string | undefined> => {
    const imagePath = path.resolve(rutaOutput, `${nombre}.png`);

    return new Promise((resolve) => {
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                console.log('No se encontró la imagen',nombre);
                resolve(undefined); // Devuelve undefined si hay un error
            } else {
                resolve(data.toString('base64')); // Devuelve los datos de la imagen si la lectura es exitosa
            }
        });
    });
}

export const borrarImagen = (nombre) => {
    const filePath = path.resolve(rutaOutput, `${nombre}.png`);

    // Verificar si el archivo existe antes de intentar borrarlo
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Imagen borrada: ${filePath}`);
    } else {
        console.log(`El archivo no existe: ${filePath}`);
    }
}