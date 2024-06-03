export function transformarTexto(username:string){
    let resultado = '';
    for (const letra of username) {
        if (letra === ' ') {
            resultado += '% ';
        } else {
            const nuevaLetra = String.fromCharCode((letra.charCodeAt(0)+1!=32?letra.charCodeAt(0)+1:letra.charCodeAt(0)));
            if (nuevaLetra === nuevaLetra.toUpperCase()) {
                resultado += nuevaLetra.toLowerCase();
            } else {
                resultado += nuevaLetra.toUpperCase();
            }
            resultado = resultado + ' ';
        }
    }
    
    return invertirPalabras(resultado);
}
export function destransformarTexto(texto:string){
    let resultado = '';
    const textoR = texto.replace(/\s/g,'');
    for (const letra of textoR) {
        if (letra === '%') {
            resultado += ' ';
        } else {
            const nuevaLetra = String.fromCharCode((letra.charCodeAt(0)-1!=32?letra.charCodeAt(0)-1:letra.charCodeAt(0)));
            if (nuevaLetra === nuevaLetra.toUpperCase()) {
                resultado += nuevaLetra.toLowerCase();
            } else {
                resultado += nuevaLetra.toUpperCase();
            }
        }
    }
    return invertirPalabras(resultado);
}

function invertirPalabras(texto:string){
    return texto.trim().split('').reverse().join('');
}