import { manejarErrores } from '../decorator';
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

    @manejarErrores
    async buscar(item: any): Promise<any> {
        const result = await this.conexion.getClient().execute(item['select'],item['params'],{prepare:true});    
        return result.first();
    }

    @manejarErrores
    async eliminar(item: any): Promise<void> {
        await this.conexion.getClient().execute(item['delete'],item['params'],{prepare:true});
    }

    @manejarErrores
    async insertar(item: any): Promise<void> {
        const params:[]= item['params'].filter(i=>!this.esUUID(i));
        await this.conexion.getClient().execute(item['insert'],params,{prepare:true});
    }
    
    @manejarErrores
    async modificar(item: any): Promise<void> {
        await this.conexion.getClient().execute(item['update'],item['params'],{prepare:true});
    }

    @manejarErrores
    async listar(item: any): Promise<any[]> {
        const result = await this.conexion.getClient().execute(item['findAll'],{prepare:true});
        const items:any[] = result.rows.map(row => row as any );
        return items;
    }

    async comandosCustoms(item:any, comando:string, accionAlItem?:Function, extension?:Iterable<readonly [string, string]>):Promise<void> {
        if (accionAlItem === undefined){
            accionAlItem = (item:any)=>{
                return item;
            }
        }
        const regex = /:(\w+)/g;
        const newQuery:string = item[comando].replace(regex,(_, match)=>{
            if(item.columnas && item.columnas.includes(match)){
                return accionAlItem!(item[match]);
            }else if(extension){
                const extensionMap = new Map(extension);
                return extensionMap.get(match) || '';
            }else {
                return '';
            }
        })
        console.log(`COMANDO: ${item[comando]}\nNUEVO COMANDO: ${newQuery}`);
        await this.conexion.getClient().execute(newQuery,undefined,{prepare:true});
    }

}