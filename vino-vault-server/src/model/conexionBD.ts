import { Client } from "cassandra-driver";
import { Credential } from "../type";

export class ConexionDataBase {
    private client:  Client;
    private conectado: boolean;
    constructor(credentials:Credential){
        this.conectado = false;
        this.client = new Client({
            contactPoints: ['127.0.0.1'], // Puedes cambiar esto a tus contact points
            localDataCenter: 'datacenter1',
            credentials: {username:credentials.username, password:credentials.password},
            keyspace: 'mykeyspace' // Asegúrate de cambiar esto al nombre de tu keyspace
        });
    }
    async conectar() {
        // Conectar al cluster de Cassandra
        try {
            await this.client.connect();
            this.conectado = true;
        } catch (error) {
          throw error;
        }
    }
    async desconectar() {
        // Desconectar del cluster de Cassandra
        try {
          await this.client.shutdown();
          this.conectado = false;
        } catch (error) {
          throw error;
        }
    }
    estaConectado() {
        return this.conectado;
    }
    getClient() {
        return this.client;
    }
}