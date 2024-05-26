import { ConexionDataBase } from './conexionBD';

export class QueryExecuterModel {

    private conexion:ConexionDataBase;

    constructor(conexion:ConexionDataBase){
        this.conexion = conexion;
    }
    private esUUID = (item: string) => {
        const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return regexUUID.test(item);

    }
    async buscar(item: any): Promise<any> {
        try {
            const result = await this.conexion.getClient().execute(item['select'],item['idsParams'],{prepare:true});    
            return result.first();
        } catch (error) {
            throw error;
        }
    }
    async eliminar(item: any): Promise<void> {
        try {
            await this.conexion.getClient().execute(item['delete'],item['idsParams'],{prepare:true});
        } catch (error) {
            throw error;
        }
    }
    async insertar(item: any): Promise<void> {
        try {
            const params:[]= item['params'].filter(i=>!this.esUUID(i));
            await this.conexion.getClient().execute(item['insert'],params,{prepare:true});
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

    comandosCustoms(item:any, comando:string):void {
        try {
            const regex = /:(\w+)/g;
            const newQuery:string = item[comando].replace(regex,(_, match)=>{
                if(item.columnas && item.columnas.includes(match)){
                    return item[match]
                }
            })
            console.log(`COMANDO: ${item[comando]}\nNUEVO COMANDO: ${newQuery}`);
            
        } catch (error) {
            throw error;
        }
    }

}