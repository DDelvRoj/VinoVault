import { BaseModelInterface } from "../type";
import { ConexionDataBase } from "./conexionBD";

export class BaseModel <T> implements BaseModelInterface <T>{
    private tabla:string;
    private selectQuery:string;
    private insertQuery:string;
    private deleteQuery:string;
    private updateQuery:string;

    protected conexion:ConexionDataBase;

    constructor(tabla:string, conexion:ConexionDataBase){
        this.tabla = tabla;
        this.selectQuery = `SELECT * FROM ${tabla} `;
        this.deleteQuery = `DELETE FROM ${tabla} `;
        this.insertQuery = `INSERT INTO ${tabla} `;
        this.updateQuery = `UPDATE ${tabla} SET `;
        this.conexion = conexion;
    }

    async modificar(where: T, changes: T): Promise<void> {
        const query = this.updateQuery + this.generarCambiosUpdate(changes) + this.generarCondicionSelect (where);
        const params = this.generarParams(changes).concat(this.generarParams(where));
        try {
            await this.conexion.getClient().execute(query,params, {prepare:true});
            console.log(`Modificación en ${this.tabla} exitosa.`);
        } catch (error) {
            
        }
    }

    async listar(): Promise<T[]> {
        const query = this.selectQuery ;
        try {
            const result = await this.conexion.getClient().execute(query, { prepare: true });
            const items: T[] = result.rows.map(row => this.mapearFilaATipo<T>(row) );
            console.log(`Listado en ${this.tabla} exitosa.`);
            return items;
        } catch (error) {
           throw error; 
        }
    }
    async buscar(item: T): Promise<T> {
        const params = this.generarParams(item);
        const query = this.selectQuery+this.generarCondicionSelect(item)+" ALLOW FILTERING";
        try {
            const result = await this.conexion.getClient().execute(query, params, {prepare:true});
            console.log(`Busqueda en ${this.tabla} exitosa.`);
            return result.first() as T;
        } catch (error) {
            throw error;
        }

    }
    async eliminar(item: T): Promise<void> {
        const params = this.generarParams(item);
        const query = this.deleteQuery+this.generarCondicionSelect(item);
        try {
            await this.conexion.getClient().execute(query, params,{prepare:true});
        } catch (error) {
            throw error;
        }
    }
    async insertar(item: T): Promise<void> {
        const params = this.generarParams(item);
        const query = this.insertQuery+this.generarCondicionInsert(item);
        try {
            await this.conexion.getClient().execute(query, params, {prepare:true});
            console.log(`Inserción a ${this.tabla} exitosa.`);
        } catch (error) {
            throw error;
        }
        
    }

    private mapearFilaATipo<T> (row: any): T {
        const item: Partial<T> = {}; // Usamos Partial<T> para permitir propiedades opcionales
        for (const key in row) {
            if (Object.prototype.hasOwnProperty.call(row, key)) {
                item[key as keyof T] = row[key]; // Usamos as keyof T para asegurar que key sea una propiedad válida de T
            }
        }
        return item as T;
    }

    private generarParams = (datos: T) => {
        console.log(datos);
        
        const keys = Object.keys(datos);
        console.log(keys);
        
        const params:any[] = keys.map((k)=>{
            const valor = datos[k];
            if (valor !== null && valor !== undefined && valor !== '') {
                return valor;
            }
        })
        console.log(params);
        
        return params;
    };
    private generarCondicionSelect = (datos: T) => {
        const keys = Object.keys(datos);
        let condicion = 'WHERE ';
        const condiciones = this.getIgualdadString(keys,datos);
        condicion += condiciones.join(' AND ');
        return condicion;
    };

    private generarCambiosUpdate = (datos:T) => {
        const keys = Object.keys(datos);
        return this.getIgualdadString(keys,datos).join(', ') ;
    }

    private getIgualdadString = (keys:string[], datos:T) => {
        return keys.map(key => {
            const valor = datos[key];
            if (this.evaluarSiHayValor(valor)) {
                return `${key} = ?`;
            }
            return null;
        }).filter(igualdad => igualdad !== null);
    }

    private evaluarSiHayValor = (valor:any) =>{
        return valor !== null && valor !== undefined && valor !== '';
    }
    
    private generarCondicionInsert = (datos:T) => {
        const keys = Object.keys(datos);
        const condicion = `(${keys.join(', ')}) VALUES (${keys.map(k=>'?').join(',')})`;
        return condicion;
    }
}