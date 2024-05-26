import { getMetadata } from "./metadataStorage";

export function Entity(tabla: string,customCommands?:[any]): ClassDecorator {
    return function(target: any) {
        const tablaNombre = tabla;

        if (customCommands) {
            const customCommandsMap:Map<string,string> = new Map<string, string>(customCommands);
            for (const [key, value] of customCommandsMap.entries()) {
                Object.defineProperty(target.prototype, key, {
                    get: function(){
                        return value;
                    } ,
                    configurable: true
                });
            }
        }
        // Métodos para construir consultas SQL aquí
        Object.defineProperty(target.prototype, 'findAll', {
            get: function(){
                return `SELECT * FROM ${tablaNombre}`;
            },
            configurable: true
        });

        Object.defineProperty(target.prototype, 'select', {
            get: function(){
                const ids = this['ids'];
                const where = ids.map(i=>`${i}=?`).filter(col=>col!=undefined ).join(' AND ')
                + (ids.length>1 || this['uuid']===undefined?' ALLOW FILTERING':"");
                return `SELECT * FROM ${tablaNombre} WHERE ${where}`;
            },
            configurable: true
        });

        Object.defineProperty(target.prototype, 'delete', {
            get: function(){
                const ids = this['ids'];
                const where = ids.map(i=>`${i}=?`).filter(col=>col!=undefined ).join(' AND ');
                return `DELETE FROM ${tablaNombre} WHERE ${where}`;
            },
            configurable: true
        });
        
        Object.defineProperty(target.prototype, 'insert', {
            get: function(){
                const metadata = getMetadata(this.constructor);
                const uuid = metadata.uuid;
                const ids = metadata.ids;
                const columnas = [];
                for (const prop of metadata.columnas) {
                    const valor = this[prop];
                    if(valor!==undefined && prop!==uuid){
                        if(!ids.includes(prop)){
                            columnas.unshift(prop);
                        }else{
                            columnas.push(prop)
                        }
                    }
                }
                if(uuid!==""){
                    columnas.push(uuid);
                }
                const insert = `(${columnas.join(', ')}) VALUES (${columnas.map(col=>(col!==uuid?'?':'uuid()')).join(', ')})`;
                return `INSERT INTO ${tablaNombre} ${insert}`;
            },
            configurable: true
        });

        Object.defineProperty(target.prototype, 'update', {
            get: function(){
                const metadata = getMetadata(this.constructor);
                const uuid = metadata.uuid;
                const columnas = [];
                for (const prop of metadata.columnas) {
                    const valor = this[prop];
                    if (valor !== undefined && prop !== uuid) {
                        columnas.push(prop);
                    }
                }
                const setValues = columnas.map(col=>`${col}=?`).filter(col=>col!=undefined ).join(', ');
                const where = `${uuid}=?`
                return `UPDATE ${tablaNombre} SET ${setValues} WHERE ${where}`;
            },
            configurable: true
        });
    };
}
