import { ConexionDataBase } from './conexionBD';

export class QueryExecuterModel {

    private conexion:ConexionDataBase;

    constructor(conexion:ConexionDataBase){
        this.conexion = conexion;
    }
    async buscar(item: any): Promise<any> {
        try {
            const result = await this.conexion.getClient().execute(item['select'],item['ids'],{prepare:true});
            return result.first();
        } catch (error) {
            throw error;
        }
    }
    async eliminar(item: any): Promise<void> {
        try {
            await this.conexion.getClient().execute(item['delete'],item['ids'],{prepare:true});
        } catch (error) {
            throw error;
        }
    }
    async insertar(item: any): Promise<void> {
        try {
            await this.conexion.getClient().execute(item['insert'],item['params'],{prepare:true});
        } catch (error) {
            throw error;
        }
    }
    async modificar(item: any): Promise<void> {
        try {
            await this.conexion.getClient().execute(item['update'],item['params'],{prepare:true});
        } catch (error) {
            throw error;
        }
    }
    async listar(item: any): Promise<any[]> {
        try {
            const result = await this.conexion.getClient().execute(item['findAll'],{prepare:true});
            const items:any[] = result.rows.map(row => row as any );
            return items;
        } catch (error) {
            throw error;
        }
    }

}