import { getMetadata } from "./metadataStorage";

export function Entity(tabla: string): ClassDecorator {
    return function(target: any) {
        const tablaNombre = tabla;
        // Métodos para construir consultas SQL aquí
        Object.defineProperty(target.prototype, 'findAll', {
            get: function(){
                return `SELECT * FROM ${tablaNombre}`;
            },
            configurable: true
        });
        Object.defineProperty(target.prototype, 'select', {
            get: function(){
                const metadata = getMetadata(this.constructor);
                const ids = this['ids'];
                const where = ids.map(i=>`${i}=?`).filter(col=>col!=undefined ).join(' AND ');
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
                const columnas = [];
                for (const prop of metadata.columnas) {
                    const valor = this[prop];
                    if (valor !== undefined && valor !== null) {
                        columnas.push(prop);
                    }
                }
                const ids = this['ids'];
                const uuid = metadata.uuid;
                
                const notIds = columnas.map(col => {
                    if(!ids.includes(col)){
                        return col;
                    }
                }).filter(col=>col!=undefined);
                const insert = `(${notIds.join(', ')}${ids!=undefined && ids!=null?', ':''}${ids.map(id => id).join(', ')}) VALUES (${notIds.map(()=>'?').join(', ')}${ids!=undefined && ids!=null?', ':''}${ids.map(i=>{
                    if(!uuid.includes(i)) return '?';
                    return 'uuid()';
                }).join(', ')})`;
                return `INSERT INTO ${tablaNombre} ${insert}`;
            },
            configurable: true
        });

        Object.defineProperty(target.prototype, 'update', {
            get: function(){
                const metadata = getMetadata(this.constructor);
                const columnas = [];
                for (const prop of metadata.columnas) {
                    const valor = this[prop];
                    if (valor !== undefined && valor !== null) {
                        columnas.push(prop);
                    }
                }
                const ids = this['ids'];
                const setValues = columnas.map(col => {
                    if(!ids.includes(col)){
                        return `${col}=?`
                    }
                }).filter(col=>col!=undefined ).join(', ');
                const where = ids.map(i=>`${i}=?`).filter(col=>col!=undefined).join(' AND ');
                
                return `UPDATE ${tablaNombre} SET ${setValues} WHERE ${where}`;
            },
            configurable: true
        });
        
    };
}