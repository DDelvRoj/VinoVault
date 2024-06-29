import { IonAvatar, IonBadge, IonButton, IonButtons, IonCardSubtitle, IonCol, IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonNote, IonPage, IonRow, IonTitle, IonToolbar, useIonAlert, useIonToast } from "@ionic/react";
import { add, checkmarkSharp, chevronBackOutline, remove, trashOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { CartStore, removeFromCart } from "../data/CartStore.ts";
import { ProductStore } from "../data/ProductStore.ts";

import  "./CartProducts.css";
import { Producto } from "../data/types.ts";
import React from "react";
import { fetchProductosVender } from "../data/fetcher.ts";

const CartProducts : React.FC = () => {

    const [ mostrar ] = useIonToast();
    const products = ProductStore.useState(s => s.products);
    const shopCart = CartStore.useState(s => s.product_ids);
    const [ cartProducts, setCartProducts ] = useState<Producto[]>([]);
    const [total, setTotal] = useState(0);
    const listaRef = useRef<{[key:string]:HTMLIonItemSlidingElement}>({});
    const [alert] = useIonAlert();

    useEffect(()=>{
        
        
        const getCarroProductos = ()=>{
            const productosCarrito = products.map(prod=>{
                let producto:Producto={
                    cantidad: 0,
                    precio: 0
                };
                const cantidadProducto = shopCart.filter(p=>prod.id_producto && prod.id_producto===p).length;
                if(cantidadProducto>0 && prod.cantidad){
                    const evaluar = cantidadProducto>prod.cantidad;
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
            productosCarrito.forEach(p=>suma=suma+(p.cantidad??0)*(p.precio??0));
            setCartProducts(productosCarrito);
            setTotal(suma);
        }
        getCarroProductos();
    },[shopCart])

    const cerrarItem = (id:string) => {
        if(listaRef.current && listaRef.current[id]){
            listaRef.current[id]?.closeOpened();
        }
    }

    const reducirCantidadCarrito = (id:string)=>{
        let shopCartTemp = [...shopCart];
        const index = shopCartTemp.findIndex(p=>p===id);
        shopCartTemp.splice(index,1);
        CartStore.update(s=>
           { s.product_ids=shopCartTemp}
        )
    }

    const borrarProductoCarrito = (id:string) => {
        removeFromCart(id);
        cerrarItem(id);
    }

    const aumentarCantidadCarrito = (id:string)=>{
        CartStore.update(s=>
           { s.product_ids=[...shopCart,id]}
        )
    }

    const handleVenta = async () => {
        const dataAEnviar = cartProducts.map(p=>{
            const nuevoProducto:Producto = {
                id_producto:p.id_producto,
                cantidad:p.cantidad
            }
            return nuevoProducto;
        });
        console.log(dataAEnviar);
        
        await fetchProductosVender(dataAEnviar).then((res)=>{
            console.log('Exitooo', res);
                setCartProducts([]);
                CartStore.update(s=>{
                    s.product_ids=[];
                    s.total=0;
            })
        }).catch(err=>{
            console.log(err);
            
        })
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
                            if ((index <= 6) && product.precio && product.cantidad) {
                                return (
                                <IonItemSliding key={ index } className="cartSlider"
                                ref={el => {
                                    if(el && product.id_producto){
                                        listaRef.current[product.id_producto] = el;
                                    }
                                }}>
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
                                            const cantidadProducto = cartProducts.filter(p=>p.id_producto===id)[0].cantidad??0;
                                            if(cantidadProducto>1){
                                                reducirCantidadCarrito(id);
                                            }
                                        }}>
                                            <IonIcon icon={remove}/>
                                        </IonItemOption>
                                        <IonItemOption color="success" style={{ paddingLeft: "1rem", paddingRight: "1rem" }} onClick={()=>{
                                            const id = product?.id_producto ?? "";
                                            aumentarCantidadCarrito(id);
                                        }}>
                                            <IonIcon icon={add}/>
                                        </IonItemOption>
                                        <IonItemOption color="danger" style={{ paddingLeft: "1rem", paddingRight: "1rem" }} 
                                            onClick={()=>{
                                                alert('¿Borrar del Carrito el producto?',[
                                                    {
                                                        text:"Sí",
                                                        handler:()=>{
                                                            const id = product?.id_producto ?? "";
                                                            borrarProductoCarrito(id);
                                                        }
                                                    },
                                                    {
                                                        text:"No",
                                                        role:"cancel"
                                                    }
                                                ])
                                            }}>
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
           
            <IonFooter className="cartFooter" >
                {
                    (shopCart.length>0) && (
                        <div className="cartCheckout">
                            <IonCardSubtitle  >{total.toLocaleString('es-ES').concat(' ₲')}</IonCardSubtitle>
                            <IonButton color="dark" onClick={async () => {
                                alert('¿Vender productos?',[
                                    {
                                         text:"Sí",
                                         handler: handleVenta
                                    },
                                    {
                                        text:'No',
                                        role: 'cancel'
                                    }
                                ])
                            }}>
                                <IonIcon  icon={ checkmarkSharp } />&nbsp;Aceptar y vender
                            </IonButton>
                        </div>
                    )
                }
            </IonFooter>
        </IonPage>
    );
}

export default CartProducts;