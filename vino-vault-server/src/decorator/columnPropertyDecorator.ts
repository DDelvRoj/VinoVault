import { getMetadata } from "./metadataStorage";

export function Column(params?: { esId?: boolean, esUUID?:boolean}): PropertyDecorator {
    return function(target: any, propertyKey: string) {
        const className = target.constructor.name;
        const metadata = getMetadata(target.constructor);
        metadata.columnas = metadata.columnas || [];
        metadata.columnas.push(propertyKey.replace(/^_/, ""));
        metadata.columnas.sort();
        if (params) {
            if(params.esId){
                metadata.ids = metadata.ids || [];
                metadata.ids.push(propertyKey);
            }
            if(params.esUUID){
                metadata.uuid = metadata.uuid || "";
                metadata.uuid = propertyKey;
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
                const valorUUID = this[metadata.uuid]
                const valores = [];
                const uuid = metadata.uuid;
                if(valorUUID===undefined){
                    for (const prop of metadata.columnas) {
                        if (metadata.ids.includes(prop)) {
                            const valor = this[prop];
                            if (valor !== undefined) {
                                valores.push(prop);
                            }
                        }
                    }
                }else if(uuid!=="" && uuid!==undefined){
                    valores.push(metadata.uuid);
                }
                return valores;
            },
            enumerable: false,
            configurable: true
        });
        
        Object.defineProperty(target, 'columnas',{
            get: function(){
                return metadata.columnas.sort();
            },
            enumerable:false,
            configurable:true
        });
        
        Object.defineProperty(target, 'params', {
            get: function() {
                const valores = [];
                const uuid = metadata.uuid;
                const ids = metadata.ids;
                for (const prop of metadata.columnas) {
                    const valor = this[prop];
                    if(valor!==undefined && prop!==uuid){
                        if(!ids.includes(prop)){
                            valores.unshift(valor)
                        }else{
                            valores.push(valor)
                        }
                    }
                }
                if((uuid!==undefined && uuid!=="") && this[uuid]!==undefined){
                    valores.push(this[uuid])
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
