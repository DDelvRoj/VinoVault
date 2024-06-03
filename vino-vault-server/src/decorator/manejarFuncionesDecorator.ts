export function manejarErrores(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const metodoOriginal = descriptor.value;

    const extraerTituloError = (error:any):string =>  {
        if (error.message) {
            return error.message.split(':')[0];
        } else if (error.title) {
            return error.title;
        }
        return error;
    }

    descriptor.value = async function (...args: any[]) {
        try {
            return await metodoOriginal.apply(this, args);
        } catch (error) {
            console.error("Error:", error);
            throw extraerTituloError(error); 
        }
    };

    return descriptor;
}