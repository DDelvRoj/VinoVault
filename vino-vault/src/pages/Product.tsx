import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import {  arrowRedoOutline, cart, cartOutline, chevronBackOutline, heart, heartOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/ProductCard.tsx";
import { addToCart, CartStore } from "../data/CartStore.ts";
import { addToFavourites, FavouritesStore } from "../data/FavouritesStore.ts";
import {  RealProductStore } from "../data/ProductStore.ts";


import "./Product.css";
import React from "react";
import { Product as ProductType } from "../data/types.ts";
import { useParams } from "react-router-dom";

const Product : React.FC = () => {

    const params= useParams() as any;
    const cartRef = useRef<HTMLIonIconElement>(null);
    const products = RealProductStore.useState(s => s.products);
    const favourites = FavouritesStore.useState(s => s.product_ids);
    const [ isFavourite, setIsFavourite ] = useState(false);
    const shopCart = CartStore.useState(s => s.product_ids);
    const [ product, setProduct ] = useState<ProductType>({});

    useEffect(() => {

        const productID = params.id;
        
        const tempProduct = products.filter(p => p.id.toString() === productID)[0];
        
        const tempIsFavourite = favourites.find(f => f === productID);

        setIsFavourite(tempIsFavourite ? true : false);
        setProduct(tempProduct);
    }, [ params.id ]);
//error de tipo2
    useEffect(() => {

        const tempIsFavourite = favourites.find(f => f ===  product.id?.toString() );
        setIsFavourite(tempIsFavourite ? true : false);
    }, [favourites, product]);

    const addProductToFavourites = (e: any, productID: number ) => {

        e.preventDefault();
        addToFavourites(productID);


        //document.getElementById(`placeholder_favourite_product_${ categorySlug }_${ productID }`).style.display = "";
        //document.getElementById(`placeholder_favourite_product_${ categorySlug }_${ productID }`).classList.add("animate__fadeOutTopRight");
    }

    const addProductToCart = (e: any, productID: number ) => {

        e.preventDefault();

        //document.getElementById(`placeholder_cart_${ categorySlug }_${ productID }`).style.display = "";
       // document.getElementById(`placeholder_cart_${ categorySlug }_${ productID }`).classList.add("animate__fadeOutUp");

        setTimeout(() => {

            cartRef.current?.classList.add("animate__tada");
            addToCart(productID);

            setTimeout(() => {
              cartRef.current?.classList.remove("animate__tada");
            }, 500);
        }, 500);
    }

    return (

        <IonPage id="category-page" className="categoryPage">
            <IonHeader>
				<IonToolbar>
                    <IonButtons slot="start">
                        <IonButton color="dark" routerLink="/" routerDirection="back">
                            <IonIcon color="dark" icon={ chevronBackOutline } />&nbsp;Ver Productos
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Ver Producto</IonTitle>

                    <IonButtons slot="end">
                        <IonBadge color="dark">
                            { shopCart.length }
                        </IonBadge>
						<IonButton color="dark" routerLink="/cart">
							<IonIcon ref={ cartRef } className="animate__animated" icon={ cart } />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			
			<IonContent fullscreen>

                <IonGrid>
                    <IonRow>
                        <IonCol size="12">
                            <IonCard className="categoryCard">
                                <IonCardHeader className="productCardHeader">
                                    <div className="productCardActions">
                                        <IonIcon className="productCardAction"  color={ isFavourite ? "danger" : "medium" } icon={ isFavourite ? heart : heartOutline } onClick={ e => addProductToFavourites(e,(product.id?product.id:0)) } />
                                        <IonIcon style={{ position: "absolute", display: "none" }} id={ `lugar_producto_favorito_${ params.id }` } className="productCardAction  animate__animated" color="danger" icon={ heart } />
                                        <IonIcon className="productCardAction" size="medium" icon={ arrowRedoOutline } />
                                    </div>
                                    
                                    <img src={ product.image } alt="product pic" />
                                    <p className="ion-text-wrap">{ product.name }</p>
                                </IonCardHeader>

                                <IonCardContent className="categoryCardContent">
                                    
                                    <div className="productPrice">
                                        <IonButton color="light" size="large">
                                            { product.price }
                                        </IonButton>
                                        <IonButton size="large" color="dark" onClick={ e => addProductToCart(e,
                                            (product.id?product.id:-1)) }>
                                            <IonIcon icon={ cartOutline } />&nbsp;&nbsp;Add to Cart
                                        </IonButton>

                                        <IonIcon icon={ cart } color="dark" style={{ position: "absolute", display: "none", fontSize: "3rem" }} id={ `lugar_carrito_${ product.id }` } className="animate__animated" />
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        </IonRow>

                        <IonRow className="ion-text-center">
                            <IonCol size="12">
                                <IonCardSubtitle>Similar products...</IonCardSubtitle>
                            </IonCol>
                        </IonRow>

                        <IonRow>
                            { products.map((otro, index) => {

                                if ((otro.id !== product.id) && product.image && index < 4) {

                                    return (

                                        <ProductCard key={ `similar_product_${ index }`} product={ otro } index={ index }  cartRef={ cartRef }/>
                                    );
                                }
                                return null;
                            }).filter(o=>o!=null)}
                        </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
}

export default Product;