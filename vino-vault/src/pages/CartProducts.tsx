import { IonAvatar, IonBadge, IonButton, IonButtons, IonCardSubtitle, IonCol, IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonNote, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { cart, checkmarkSharp, chevronBackOutline, trashOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { CartStore, removeFromCart } from "../data/CartStore.ts";
import { ProductStore } from "../data/ProductStore.ts";

import  "./CartProducts.css";
import { ConjuntoProducto } from "../data/types.ts";
import React from "react";

const CartProducts : React.FC = () => {

    const cartRef = useRef<HTMLIonIconElement>(null);
    const products = ProductStore.useState(s => s.products);
    const shopCart = CartStore.useState(s => s.product_ids);
    const [ cartProducts, setCartProducts ] = useState<ConjuntoProducto[]>([]);
    

    const [ total, setTotal ] = useState(0);

    useEffect(() => {

        const getCartProducts = () => {

            setCartProducts([]);
            setTotal(0);

            shopCart.forEach(product => {

                var favouriteParts = product.split("/");
                var categorySlug = favouriteParts[0];
                var productID = favouriteParts[1];
                
                const tempCategory = products.filter(p => p.slug === categorySlug)[0];
                const tempProduct = tempCategory.products.filter(p => p.id=== parseInt(productID))[0];

                const tempCartProduct:ConjuntoProducto = {

                    category: tempCategory,
                    product: tempProduct
                };

                setTotal(prevTotal => prevTotal + parseInt(tempProduct.price.replace("£", "")));
                setCartProducts(prevSearchResults => [ ...prevSearchResults, tempCartProduct ]);
            });
        }

        getCartProducts();
    }, [ shopCart,products ]);


    const removeProductFromCart = async (index: number) => {

        removeFromCart(index);
    }

    return (

        <IonPage id="category-page" className="categoryPage">
            <IonHeader>
				<IonToolbar>
                    <IonButtons slot="start">
                        <IonButton color="dark" routerLink="/" routerDirection="back">
                            <IonIcon color="dark" icon={ chevronBackOutline } />&nbsp;Categorias
                        </IonButton>
                    </IonButtons>
					<IonTitle>Carrito</IonTitle>

                    <IonButtons slot="end">
                        <IonBadge color="dark">
                            { shopCart.length }
                        </IonBadge>
						<IonButton color="dark">
							<IonIcon ref={ cartRef } className="animate__animated" icon={ cart } />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			
			<IonContent fullscreen>

                    <IonRow className="ion-text-center ion-margin-top">
                        <IonCol size="12">
                            <IonNote>{ cartProducts && cartProducts.length } { (cartProducts.length > 1 || cartProducts.length === 0) ? " products" : " product" } found</IonNote>
                        </IonCol>
                    </IonRow>

                    <IonList>
                        { cartProducts && cartProducts.map((product, index) => {

                            if ((index <= 6)) {
                                return (
                                <IonItemSliding className="cartSlider">
                                    <IonItem key={ index } lines="none" detail={ false } className="cartItem ">

                                        <IonAvatar>
                                            <IonImg src={ product.product.image } />
                                        </IonAvatar>
                                        <IonLabel className="ion-padding-start ion-text-wrap">
                                            <p>{ product.category.name }</p>
                                            <h4>{ product.product.name }</h4>
                                        </IonLabel>

                                        <div className="cartActions">
                                            <IonBadge color="dark">{ product.product.price }</IonBadge>
                                        </div>
                                    </IonItem>

                                    <IonItemOptions side="end">
                                        <IonItemOption color="danger" style={{ paddingLeft: "1rem", paddingRight: "1rem" }} onClick={ () => removeProductFromCart(index) }>
                                            <IonIcon icon={ trashOutline } />
                                        </IonItemOption>
                                    </IonItemOptions>
                                </IonItemSliding>
                                );
                            }
                            return null;
                        }).filter(o=>o!=null)}
                    </IonList>
            </IonContent>

            <IonFooter className="cartFooter">
                <div className="cartCheckout">
                    <IonCardSubtitle>£{ total.toFixed(2) }</IonCardSubtitle>

                    <IonButton color="dark">
                        <IonIcon icon={ checkmarkSharp } />&nbsp;Checkout
                    </IonButton>
                </div>
            </IonFooter>
        </IonPage>
    );
}

export default CartProducts;