import { getMetadata } from "./metadataStorage";

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
                            valores.push(prop);
                        }
                    }
                }
                return valores;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(target, 'idsParams', {
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
