import { IonAvatar, IonBadge, IonButton, IonButtons, IonCardSubtitle, IonCol, IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonNote, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { cart, checkmarkSharp, chevronBackOutline, trashOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { CartStore, removeFromCart } from "../data/CartStore.ts";
import { RealProductStore } from "../data/ProductStore.ts";

import  "./CartProducts.css";
import { Product } from "../data/types.ts";
import React from "react";

const CartProducts : React.FC = () => {

    const cartRef = useRef<HTMLIonIconElement>(null);
    const products = RealProductStore.useState(s => s.products);
    const shopCart = CartStore.useState(s => s.product_ids);
    const [ cartProducts, setCartProducts ] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(()=>{
        
        
        const getCarroProductos = ()=>{
            const productosCarrito = products.map(p=>{
                if(p != undefined && shopCart.includes(p.id.toString())){
                    return p;
                }
                return null;
            }).filter(p=>p!=null);
            let suma = 0;
            productosCarrito.forEach(p=>suma+=parseFloat(p.price.replace('£','')))
            setCartProducts(productosCarrito);
            setTotal(suma);
        }
        getCarroProductos();
    },[shopCart])


    const removeProductFromCart = async (index: number) => {

        removeFromCart(index);
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
					<IonTitle>Carrito</IonTitle>
				</IonToolbar>
			</IonHeader>
			
			<IonContent fullscreen>

                    <IonRow className="ion-text-center ion-margin-top">
                        <IonCol size="12">
                            <IonNote>{ cartProducts && cartProducts.length } { (cartProducts.length > 1 || cartProducts.length === 0) ? " productos encontrados." : " producto encontrado." }</IonNote>
                        </IonCol>
                    </IonRow>

                    <IonList>
                        { cartProducts && cartProducts.map((product, index) => {

                            if ((index <= 6)) {
                                return (
                                <IonItemSliding key={ index } className="cartSlider">
                                    <IonItem  lines="none" detail={ false } className="cartItem ">

                                        <IonAvatar>
                                            <IonImg src={ product.image } />
                                        </IonAvatar>
                                        <IonLabel className="ion-padding-start ion-text-wrap">
                                            <h4>{ product.name }</h4>
                                        </IonLabel>

                                        <div className="cartActions">
                                            <IonBadge color="dark">{ product.price }</IonBadge>
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
                        <IonIcon icon={ checkmarkSharp } />&nbsp;Aceptar y vender
                    </IonButton>
                </div>
            </IonFooter>
        </IonPage>
    );
}

export default CartProducts;