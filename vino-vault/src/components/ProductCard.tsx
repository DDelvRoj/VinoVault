import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonIcon } from "@ionic/react";
import { arrowRedoOutline, cart, cartOutline, heart, heartOutline } from "ionicons/icons";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { addToCart } from "../data/CartStore.ts";
import { addToFavourites, FavouritesStore } from "../data/FavouritesStore.ts";
import  "./ProductCard.css";
import React from "react";


interface ProductCardProps{
    product: any; 
    category?: any; 
    index?: any; 
    cartRef?: any
}


const ProductCard : React.FC<ProductCardProps> = (props) => {

    const { product, category, index, cartRef } = props;
    const favourites = FavouritesStore.useState(s => s.product_ids);

    const productCartRef = useRef();
    const productFavouriteRef = useRef(null);
    const [ isFavourite, setIsFavourite ] = useState(false);

    useEffect(() => {

        const tempIsFavourite = favourites.find(f => f === `${ category.slug }/${ product.id }`);
        setIsFavourite(tempIsFavourite ? true : false);
    }, [props.product, favourites, category.slug, product.id]);

    const addProductToFavourites = (categorySlug: any, productID: any) => {

        //e.preventDefault();
        //e.stopPropagation();
        addToFavourites(categorySlug, productID);


        //productFavouriteRef.current.style.display = "";
      //  productFavouriteRef.current.classList.add("animate__fadeOutTopRight");

        setTimeout(() => {
            if (productCartRef.current) {
               // productFavouriteRef.current.classList.remove("animate__fadeOutTopRight");
                //productFavouriteRef.current.style.display = "none";
            }
        }, 500);
    }

    const addProductToCart = (e: MouseEvent<HTMLIonButtonElement, globalThis.MouseEvent>, categorySlug: any, productID: any) => {

        e.preventDefault();
        e.stopPropagation();

       // productCartRef.current.style.display = "";
       // productCartRef.current.classList.add("animate__fadeOutUp");

        setTimeout(() => {

            cartRef.current.classList.add("animate__tada");
            addToCart(categorySlug, productID);

            setTimeout(() => {
                
                cartRef.current.classList.remove("animate__tada");
            //    productCartRef.current.style.display = "none";
            }, 500);
        }, 500);
    }

    return (

        <IonCol size="6" key={`category_product_list_${index}`}>
            <IonCard routerLink={`/category/${category.slug}/${product.id}`} className="categoryCard">
                <IonCardHeader className="productCardHeader">
                    <div className="productCardActions">
                        <IonIcon className="productCardAction" color={isFavourite ? "danger" : "medium"} icon={isFavourite ? heart : heartOutline} onClick={() => addProductToFavourites(category.slug, product.id)}/>
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
                        <IonButton color="dark" onClick={e => addProductToCart(e, category.slug, product.id)} >
                            <IonIcon icon={cartOutline}  />
                        </IonButton>

                        <IonIcon icon={ cart } color="dark" style={{ position: "absolute", display: "none", fontSize: "3rem" }} className="animate__animated" />
                    </div>
                </IonCardContent>
            </IonCard>
        </IonCol>
    );
}

export default ProductCard;