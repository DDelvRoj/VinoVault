import { Client } from "cassandra-driver";
import  { Request } from 'express';

// Permite crear un objeto de sesion para Cassandra
export const crearSesion = (req: Request): Client => {

    const  username:string = req.body['username'];
    const  password:string = req.body['password'];

    console.log(`Objecto Cliente ${username} creado.`);
    return new Client({
      contactPoints: ['127.0.0.1'], // Puedes cambiar esto a tus contact points
      localDataCenter: 'datacenter1',
      credentials: { username: username, password: password },
      keyspace: 'mykeyspace' // Asegúrate de cambiar esto al nombre de tu keyspace
    });
}
// Conexión a Cassandra
export const conectar = async (cliente: Client): Promise<boolean> => {
  try {
    await cliente.connect();
    console.log('Conexión exitosa a Cassandra');
    return false;
  } catch (err) {
    console.error('Error al conectar a Cassandra', err);
    return true;
  }
}

// Cerrar conexión a Cassandra
export const apagar = async (cliente: Client): Promise<void> => {
  await cliente.shutdown().then(() => {
    console.log("Sesión cerrada.");
  }).catch(err => {
    console.error("Error al cerrar la sesión ", err);
  })
}

// Funcion auxiliar solo para visor, no tiene poder sobre otras tablas.
export const crearSesionVisor = ():Client =>{
  const visor: Request = {
    body: {
      username: "visor",
      password: "visor"
    }
  }  as Request;
  return crearSesion(visor);
}
  
