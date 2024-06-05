import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonIcon } from "@ionic/react";
import { arrowRedoOutline, cart, cartOutline, heart, heartOutline } from "ionicons/icons";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { addToCart } from "../data/CartStore.ts";
import { addToFavourites, FavouritesStore } from "../data/FavouritesStore.ts";
import  "./ProductCard.css";
import React from "react";


interface ProductCardProps{
    product: any; 
    index?: any; 
    cartRef?: any
}


const ProductCard : React.FC<ProductCardProps> = (props) => {

    const { product, index, cartRef } = props;
    const favourites = FavouritesStore.useState(s => s.product_ids);

    const productCartRef = useRef<HTMLIonIconElement>(null);
    const productFavouriteRef = useRef<HTMLIonIconElement>(null);
    const [ isFavourite, setIsFavourite ] = useState(false);

    useEffect(() => {
        const tempIsFavourite = favourites.find(f => f === `${ product.id }`);
        setIsFavourite(tempIsFavourite ? true : false);
    }, [props.product, favourites]);

    const addProductToFavourites = (e:any, productID: any) => {

        e.preventDefault();
        e.stopPropagation();
        addToFavourites(productID);


        if(productFavouriteRef.current){
            productFavouriteRef.current.style.display = "";
            //productFavouriteRef.current.classList.add("animate__fadeOutTopRight");
        }

        setTimeout(() => {
            if (productFavouriteRef.current) {
               //productFavouriteRef.current.classList.remove("animate__fadeOutTopRight");
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
            //productCartRef.current.classList.add("animate__fadeOutUp");
        }

        setTimeout(() => {

            //cartRef.current.classList.add("animate__bounce");
            

            setTimeout(() => {
                
               // cartRef.current.classList.remove("animate__tada");
                if(productCartRef.current){
                    productCartRef.current.style.display = "none";
                }
            }, 500);
        }, 500);
    }

    return (

        <IonCol size="6" key={`producto_lista_${index}`}>
            <IonCard routerLink={`/producto/${product.id}`} className="categoryCard">
                <IonCardHeader className="productCardHeader">
                    <div className="productCardActions">
                        <IonIcon className="productCardAction" color={isFavourite ? "danger" : "medium"} icon={isFavourite ? heart : heartOutline} onClick={(e) => addProductToFavourites(e, product.id)}/>
                        <IonIcon ref={ productFavouriteRef } style={{ position: "absolute", display: "none" }} className="productCardAction animate__animated " color="danger" icon={ heart } />
                        <IonIcon className="productCardAction" size="medium" icon={arrowRedoOutline} />
                    </div>
                    <img src={ product.image } alt="product pic" />
                    <p className="ion-text-wrap">{ product.name }</p>
                </IonCardHeader>

                <IonCardContent className="categoryCardContent" >
                    
                    <div className="productPrice">
                        <IonButton style={{ width: "100%" }} color="light" >
                            { product.price }
                        </IonButton>
                        <IonButton color="dark" onClick={e => addProductToCart(e, product.id)} >
                            <IonIcon ref={cartRef} icon={cartOutline}  />
                        </IonButton>

                        <IonIcon ref={productCartRef} icon={ cart } color="dark" style={{ position: "absolute", display: "none", fontSize: "3rem" }} className="animate__animated" />
                    </div>
                </IonCardContent>
            </IonCard>
        </IonCol>
    );
}

export default ProductCard;