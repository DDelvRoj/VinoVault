import { Client } from 'cassandra-driver';

export class ConexionDataBase {
    private client: Client;
    private conectado: boolean;

    constructor(credentials: { username: string, password: string }) {
        this.conectado = false;
        this.client = new Client({
            contactPoints: ['127.0.0.1'], // IP de tu Cassandra
            localDataCenter: 'datacenter1',
            credentials: { username: credentials.username, password: credentials.password },
            keyspace: 'stock_vinos' // Nombre de tu keyspace
        });
    }

    // Conectar a Cassandra
    async conectar() {
        try {
            console.log('Intentando conectar a Cassandra...');
            await this.client.connect();
            this.conectado = true;
            console.log('Conexión exitosa a Cassandra');
        } catch (error) {
            console.error('Error al conectar con Cassandra:', error);
            throw error; // Lanza el error para ser manejado fuera
        }
    }

    // Desconectar de Cassandra
    async desconectar() {
        try {
            await this.client.shutdown();
            this.conectado = false;
            console.log('Desconexión exitosa de Cassandra');
        } catch (error) {
            console.error('Error al desconectar de Cassandra:', error);
        }
    }

    estaConectado() {
        return this.conectado;
    }

    getClient() {
        return this.client;
    }
}
