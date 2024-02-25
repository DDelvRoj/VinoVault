import jwt from 'jsonwebtoken';

const SECRET_KEY: string | undefined = process.env.CLAVE_FIRMA;

export const firmarToken = (data:any)=>{
    return  jwt.sign(data, SECRET_KEY || '');
}