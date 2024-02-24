import bcrypt from 'bcrypt';


async function encriptarPassword(password:string){
    return await bcrypt.hash(password, 10);
}

async function desencriptarYCompararPassword(password:string, hasshedPassword:string){
    return await bcrypt.compare(password, hasshedPassword);
}

export default {encriptarPassword, desencriptarYCompararPassword};