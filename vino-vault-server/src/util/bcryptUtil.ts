import bcrypt from 'bcrypt';


async function encriptarData(data:string){
    return await bcrypt.hash(data, 10);
}

async function desencriptarYCompararData(data:string, hasshedData:string){
    return await bcrypt.compare(data, hasshedData);
}

export default {encriptarData, desencriptarYCompararData};