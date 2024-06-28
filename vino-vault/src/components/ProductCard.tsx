import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonIcon, IonRow } from "@ionic/react";
import { cart, cartOutline, createOutline, heart, heartOutline } from "ionicons/icons";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { addToCart, CartStore } from "../data/CartStore.ts";
import { addToFavourites, FavouritesStore } from "../data/FavouritesStore.ts";
import  "./ProductCard.css";
import React from "react";
import { Producto } from "../data/types.ts";

interface ProductCardProps{
    product: Producto; 
    index?: any; 
    cartRef?: any;
    editarProducto: Function;
}

const ProductCard : React.FC<ProductCardProps> = (props) => {

    const { product, index, cartRef, editarProducto } = props;
    const favourites = FavouritesStore.useState(s => s.product_ids);
    const productoEnCompra = CartStore.useState(s=>s.product_ids.filter(id=>id===product.id_producto).length);
    const productCartRef = useRef<HTMLIonIconElement>(null);
    const productFavouriteRef = useRef<HTMLIonIconElement>(null);
    const [ isFavourite, setIsFavourite ] = useState(false);

    useEffect(() => {
        const tempIsFavourite = favourites.find(f => f === `${ product.id_producto }`);
        setIsFavourite(tempIsFavourite ? true : false);
    }, [props.product, favourites]);

    const addProductToFavourites = (e:any, productID: any) => {

        e.preventDefault();
        e.stopPropagation();

        addToFavourites(productID);

        if(productFavouriteRef.current){
            productFavouriteRef.current.style.display = "";
        }

        setTimeout(() => {
            if (productFavouriteRef.current) {
                productFavouriteRef.current.style.display = "none";
            }
        }, 500);
    }

    const addProductToCart = (e: MouseEvent<HTMLIonButtonElement, globalThis.MouseEvent>, productID: any) => {

        e.preventDefault();
        e.stopPropagation();
        
        addToCart(productID);

        if(productCartRef.current){
            productCartRef.current.style.display = "";
        }

        setTimeout(() => {
            setTimeout(() => {
                if(productCartRef.current){
                    productCartRef.current.style.display = "none";
                }
            }, 500);
        }, 500);

    }

    return (
        <IonCol size="6" key={`producto_lista_${index}`}>
            <IonCard routerLink={`/producto/${product.id_producto}`} className="categoryCard">
                <IonCardHeader className="productCardHeader">
                    <div className="productCardActions">
                        <IonIcon className="productCardAction" color={isFavourite ? "danger" : "medium"} icon={isFavourite ? heart : heartOutline} onClick={(e) => addProductToFavourites(e, product.id_producto)}/>
                        <IonIcon ref={ productFavouriteRef } style={{ position: "absolute", display: "none" }} className="productCardAction" color="danger" icon={ heart }  />
                        <IonIcon className="productCardAction" size="medium" icon={createOutline} onClick={(e)=>editarProducto(e, product)}/>
                    </div>
                    <img src={(product?.imagen??"img-no-encontrado.png") } alt="product pic" />
                    <p className="ion-text-wrap">{ product.nombre_producto }</p>
                </IonCardHeader>
                <IonCardContent className="categoryCardContent" >
                    <div className="productPrice">
                        <IonRow>
                            <IonButton className="auto-width-button" color="light" >
                                { product.precio?.toLocaleString('es-ES').concat(' ₲') }
                            </IonButton>
                            
                            {
                            product.cantidad && product.cantidad - productoEnCompra > 0 && (
                                <>
                                    <IonButton className="auto-width-button" color="dark" onClick={e => addProductToCart(e, product.id_producto)} >
                                        <IonIcon ref={cartRef} icon={cartOutline}  />
                                    </IonButton>
                                    <IonIcon ref={productCartRef} icon={ cart } color="dark" style={{ position: "absolute", display: "none", fontSize: "3rem" }}/>
                                </>
                                )
                            }
                            {product.cantidad && (
                                <IonButton className="auto-width-button" color={product.cantidad - productoEnCompra>1?'tertiary':'danger'}>
                                    {product.cantidad - productoEnCompra } restantes
                                </IonButton>
                            )
                            }
                        </IonRow>
                        
                    </div>
                </IonCardContent>
            </IonCard>
        </IonCol>
    );
}

export default ProductCard;