import { Client } from "cassandra-driver";


export class UsuarioModel {
  client:  Client;
  constructor(nClient: Client) {
    // Crear una conexión al cluster de Cassandra
    this.client = nClient;
  }

  async conectar() {
    // Conectar al cluster de Cassandra
    await this.client.connect();
    console.log('Conexión exitosa a Cassandra');
  }

  async desconectar() {
    // Desconectar del cluster de Cassandra
    await this.client.shutdown();
    console.log('Conexión cerrada a Cassandra');
  }

  async obtenerUsuarioPorUsername(userName:string) {
    // Consultar el usuario por su ID
    const query = 'SELECT * FROM users WHERE username = ?';
    const params = [userName];
    try {
      const result = await this.client.execute(query, params, { prepare: true });
      return result.rows[0];
    } catch (error) {
      console.error('Error al obtener usuario por Username:', error);
      throw { error: 'Credenciales inválidas' };
    }
  }

  async crearUsuario(nombre:string, hashedPassword:string) {
    // Insertar un nuevo usuario en la tabla de usuarios
    const query = 'INSERT INTO users (username, password, creado) VALUES (?, ?, ?)';
    const params = [nombre, hashedPassword, false];
    try {
      await this.client.execute(query, params, { prepare: true });
      console.log('Usuario creado exitosamente');
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

}