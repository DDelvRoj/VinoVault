import { translate } from "@vitalets/google-translate-api";



export async function traducir(texto:string) {
    try {
        const {text} = await translate(texto,{to:'es'});
        return text;
    } catch (error) {
        console.error("No se pudo traducir ",error);
        return texto;
    }
}