import puppeteer, { Page } from "puppeteer";
import fetch from 'node-fetch';
import { traducir } from "../util/traductorUtil";
import { ProductoTemp } from "../type";
import { guardarImagen } from "../util/imagenesUtil";


const browser = puppeteer.launch({
    headless:true,
    'args' : [
        '--no-sandbox',
        '--disable-setuid-sandbox'
    ]
});

async function buscarCodigoDeBarra (codigo:string){
    const page:Page = await (await browser).newPage();
    try {
        
        await page.setCacheEnabled(false);
        const link = `https://go-upc.com/search?q=${codigo}`;
        console.log(link);
        page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'stylesheet') {
            req.abort();
            } else {
            req.continue();
            }
        });
        await page.goto(link, { waitUntil: 'domcontentloaded' });

        const elementoNombre = await page.$('h1.product-name');
        const nombreProducto:string = await page.evaluate(el => el.textContent.trim(), elementoNombre);
        // Obtener el texto del siguiente td después de cada td con clase "metadata-label"
        const marca:string = await page.$$eval('.metadata-label', tds => {
            let marca:string;
            tds.forEach(td => {
                const titulo = td.textContent.trim().toLowerCase();
                console.log(titulo);
                if(titulo.includes('brand')){
                    marca = td.nextElementSibling.textContent.trim();
                }
            });
            return marca;
        });
        const descripcion:string = await page.$$eval('h2', h2s=>{
            let desc:string='';
            h2s.forEach(h2=>{
                const titulo = h2.textContent.trim().toLowerCase();
                if(titulo.includes('description')){
                    desc = h2.nextElementSibling.textContent.trim();
                    return;
                }
            });
            return desc;
        });
        
        const imagenTag = await page.$('.product-image.mobile > img');
        const src = imagenTag ? await (await imagenTag.getProperty('src')).jsonValue() : null;
        let base64ImageData = null;
        if(src){
            const response = await fetch(src);
            // Convertir los datos de la imagen a base64
            const imageData = await response.buffer();
            base64ImageData = imageData.toString('base64');
            guardarImagen(imageData,codigo); 
        }
        const descripcionTraducida:string = await traducir(descripcion);
        const producto:ProductoTemp={
            ean: codigo,
            nombre_producto: nombreProducto,
            descripcion:descripcionTraducida,
            marca: marca,
            imagen: base64ImageData
        };
        
        return producto;
    } catch (error) {
        throw error;
    } finally {
        const cookies = await page.cookies();
        for (let cookie of cookies) {
        await page.deleteCookie(cookie);
        }
        await page.close();
    }
}

export default buscarCodigoDeBarra;
