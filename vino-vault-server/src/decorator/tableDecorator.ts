const metadataStorage: WeakMap<any, any> = new WeakMap();

function getMetadata(target: any): any {
    let metadata = metadataStorage.get(target);
    if (!metadata) {
        metadata = {};
        metadataStorage.set(target, metadata);
    }
    return metadata;
}
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
                const ids = metadata.ids;
                const where = ids.map(i=>`${i}=?`).filter(col=>col!=undefined && this[col] !== undefined && this[col] !== null).join(' AND ');
                return `SELECT * FROM ${tablaNombre} ${(where===undefined || where===null)?'WHERE':''} ${where?where:''}`;
            },
            configurable: true
        });
        Object.defineProperty(target.prototype, 'delete', {
            get: function(){
                const metadata = getMetadata(this.constructor);
                const ids = metadata.ids;
                const where = ids.map(i=>`${i}=?`).filter(col=>col!=undefined && this[col] !== undefined && this[col] !== null).join(' AND ');
                return `DELETE FROM ${tablaNombre} ${(where===undefined || where===null)?'WHERE':''} ${where?where:''}`;
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
                const ids = metadata.ids;
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
                const ids = metadata.ids;
                const setValues = columnas.map(col => {
                    if(!ids.includes(col)){
                        return `${col}=?`
                    }
                }).filter(col=>col!=undefined ).join(', ');
                const where = ids.map(i=>`${i}=?`).filter(col=>col!=undefined && this[col] !== undefined && this[col] !== null).join(' AND ');
                return `UPDATE ${tablaNombre} SET ${setValues} ${(where===undefined || where===null)?'WHERE':''} ${where?where:''}`;
            },
            configurable: true
        });
        
    };
}

export function Column(params?: { esId?: boolean, esUUID?:boolean}): PropertyDecorator {
    return function(target: any, propertyKey: string) {
        const className = target.constructor.name;
        const metadata = getMetadata(target.constructor);
        metadata.columnas = metadata.columnas || [];
        metadata.columnas.push(propertyKey.replace(/^_/, ""));

        if (params) {
            if(params.esId){
                metadata.ids = metadata.ids || [];
                metadata.ids.push(propertyKey);
            }
            if(params.esUUID){
                metadata.uuid = metadata.uuid || [];
                metadata.uuid.push(propertyKey);
            }
            
        }

        Object.defineProperty(target, propertyKey, {
            get: function() {
                return this[`_${propertyKey}`];
            },
            set: function(nuevoValor: any) {
                console.log(`Se ha asignado un nuevo valor "${nuevoValor}" a la columna "${propertyKey}" de la clase "${className}"`);
                this[`_${propertyKey}`] = nuevoValor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(target, 'ids', {
            get: function() {
                const valores = [];
                for (const prop of metadata.columnas) {
                    if (metadata.ids.includes(prop)) {
                        const valor = this[prop];
                        if (valor !== undefined && valor !== null) {
                            valores.push(valor);
                        }
                    }
                }
                return valores;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(target, 'params', {
            get: function() {
                const valores = [];
                for (const prop of metadata.columnas) {
                    if (!metadata.ids.includes(prop)) {
                        const valor = this[prop];
                        if (valor !== undefined && valor !== null) {
                            valores.push(valor);
                        }
                    }
                }
                for (const prop of metadata.columnas) {
                    if (metadata.ids.includes(prop)) {
                        const valor = this[prop];
                        if (valor !== undefined && valor !== null) {
                            valores.push(valor);
                        }
                    }
                }
                return valores;
            },
            enumerable: false,
            configurable: true
        });
        
        

        target.set = function(data: any) {
            const instanceMetadata = getMetadata(this.constructor);
            for (const prop in data) {
                if (instanceMetadata.columnas.includes(prop)) {
                    this[prop] = data[prop];
                } else {
                    console.log(`La propiedad "${prop}" no es una columna válida en la clase "${className}"`);
                }
            }
        };    
    };
}
