import { IonAlert, IonAvatar, IonBadge, IonButton, IonButtons, IonCardSubtitle, IonCol, IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonNote, IonPage, IonRow, IonTitle, IonToolbar, useIonToast } from "@ionic/react";
import { add, checkmarkSharp, chevronBackOutline, remove, trashOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { CartStore, removeFromCart } from "../data/CartStore.ts";
import { ProductStore } from "../data/ProductStore.ts";

import  "./CartProducts.css";
import { Producto } from "../data/types.ts";
import React from "react";

const CartProducts : React.FC = () => {

    const [ mostrar ] = useIonToast();
    const products = ProductStore.useState(s => s.products);
    const shopCart = CartStore.useState(s => s.product_ids);
    const [mostrarAlert, setMostrarAlert] = useState(false);
    const [idProductoReciente, setIdProductoReciente] = useState("");
    const [ cartProducts, setCartProducts ] = useState<Producto[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(()=>{
        
        
        const getCarroProductos = ()=>{
            const productosCarrito = products.map(prod=>{
                let producto:Producto={
                    cantidad: 0,
                    precio: 0
                };
                const cantidadProducto = shopCart.filter(p=>prod.id_producto && prod.id_producto===p).length;
                if(cantidadProducto>0){
                    const evaluar = cantidadProducto>prod.cantidad;
                    console.log(`Marca ${prod.marca} cantidadComprar ${cantidadProducto} y cantidadStock ${prod.cantidad} = ${evaluar}`);
                    
                    if(evaluar){
                        mostrar(`Tenés ${prod.cantidad} del producto "${prod.nombre_producto}" en stock, no se puede pasar de la cantidad, se necesita reposición.`
                            ,5000);
                        let diferencia = cantidadProducto-prod.cantidad;
                        let shopCartTemp = [...shopCart];
                        shopCartTemp = shopCartTemp.map(p=>{
                            if(prod.id_producto && prod.id_producto===p && diferencia>0){
                                diferencia-=1;
                                return null;
                            }
                            return p;
                        }).filter(p=>p!=null);
                        CartStore.update(s=>
                            { s.product_ids=shopCartTemp}
                        );
                    } else {
                        producto = Object.assign(Object.create(Object.getPrototypeOf(prod)), prod);
                        producto.cantidad = cantidadProducto;
                    }
                }
                return producto;
            }).filter(p=>p.id_producto!=undefined);
            let suma = 0;
            productosCarrito.forEach(p=>suma=suma+p.cantidad*p.precio);
            setCartProducts(productosCarrito);
            setTotal(suma);
        }
        getCarroProductos();
    },[shopCart])

    const reducirCantidadCarrito = (id:string)=>{
        let shopCartTemp = [...shopCart];
        mostrar('Borrar',2000)
        const index = shopCartTemp.findIndex(p=>p===id);
        shopCartTemp.splice(index,1);
        CartStore.update(s=>
           { s.product_ids=shopCartTemp}
        )
    }

    const aumentarCantidadCarrito = (id:string)=>{
        CartStore.update(s=>
           { s.product_ids=[...shopCart,id]}
        )
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
                                            <IonImg src={(product?.imagen??"img-no-encontrado.png")} />
                                        </IonAvatar>
                                        <IonLabel className="ion-padding-start ion-text-wrap">
                                            <h4>{ product.nombre_producto }</h4>
                                        </IonLabel>
                                        
                                        <div className="cartActions" style={{ paddingLeft: "1rem" }}>
                                            <IonBadge color="dark">{ product.cantidad.toLocaleString('es-ES') }</IonBadge>
                                        </div>
                                        &nbsp;x&nbsp;
                                        <div className="cartActions" >
                                            <IonBadge color="dark">{ product.precio.toLocaleString('es-ES').concat(' ₲') }</IonBadge>
                                        </div>
                                        &nbsp;=&nbsp;
                                        <div className="cartActions">
                                            <IonBadge color="dark">{ (product.precio * product.cantidad).toLocaleString('es-ES').concat(' ₲')}</IonBadge>
                                        </div>
                                    </IonItem>
                                    <IonItemOptions side="end">
                                        <IonItemOption color="light" style={{ paddingLeft: "1rem", paddingRight: "1rem" }} onClick={()=>{
                                            const id = product?.id_producto ?? "";
                                            setIdProductoReciente(id);
                                            const cantidadProducto = cartProducts.filter(p=>p.id_producto===id)[0].cantidad;
                                            if(cantidadProducto>1){
                                                reducirCantidadCarrito(id);
                                            }else{
                                                setMostrarAlert(!mostrarAlert);
                                            }
                                            }}>
                                            <IonIcon icon={remove}/>
                                        </IonItemOption>
                                        <IonItemOption color="success" style={{ paddingLeft: "1rem", paddingRight: "1rem" }} onClick={()=>{
                                            const id = product?.id_producto ?? "";
                                            setIdProductoReciente(id);
                                            aumentarCantidadCarrito(id);
                                        }}>
                                            <IonIcon icon={add}/>
                                        </IonItemOption>
                                        <IonItemOption color="danger" style={{ paddingLeft: "1rem", paddingRight: "1rem" }} 
                                            onClick={ () => {
                                                const id = product?.id_producto ?? "";
                                                setIdProductoReciente(id);
                                                if(id!==""){
                                                    setMostrarAlert(!mostrarAlert);
                                                }
                                            } 
                                        }>
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
            <IonAlert isOpen={mostrarAlert} onDidDismiss={()=>setMostrarAlert(!mostrarAlert)}  header="¿Quitar del carrito el producto?"
                message="Presione Sí para confirmar."
                buttons={[
                    {
                        text:'Sí',
                        role: 'confirm',
                        handler:()=>removeFromCart(idProductoReciente)
                    },
                    {
                        text:'No',
                        role:'cancel'
                    }
                ]}
            />
            <IonFooter className="cartFooter">
                <div className="cartCheckout">
                    <IonCardSubtitle>{total.toLocaleString('es-ES').concat(' ₲')}</IonCardSubtitle>
                    <IonButton color="dark">
                        <IonIcon icon={ checkmarkSharp } />&nbsp;Aceptar y vender
                    </IonButton>
                </div>
            </IonFooter>
        </IonPage>
    );
}

export default CartProducts;