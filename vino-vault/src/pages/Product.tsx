import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonToast } from "@ionic/react";
import {   cart, cartOutline, chevronBackOutline, heart, heartOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/ProductCard.tsx";
import { addToCart, CartStore } from "../data/CartStore.ts";
import { addToFavourites, FavouritesStore } from "../data/FavouritesStore.ts";
import {  ProductStore } from "../data/ProductStore.ts";


import "./Product.css";
import React from "react";
import { Producto } from "../data/types.ts";
import { useParams } from "react-router-dom";

const Product : React.FC = () => {

    const params= useParams() as any;
    const cartRef = useRef<HTMLIonIconElement>(null);
    const products = ProductStore.useState(s => s.products);
    const favourites = FavouritesStore.useState(s => s.product_ids);
    const [ isFavourite, setIsFavourite ] = useState(false);
    const productoEnCompra = CartStore.useState(s=>s.product_ids.filter(id=>id===product.id_producto).length);
    const [logs] = useIonToast();
    const shopCart = CartStore.useState(s => s.product_ids);
    const [ product, setProduct ] = useState<Producto>({cantidad:0, precio:0});

    useEffect(() => {

        const productID = params.id;
        
        const tempProduct = products.filter(p => p.id_producto === productID)[0];
        
        const tempIsFavourite = favourites.find(f => f === productID);

        setIsFavourite(tempIsFavourite ? true : false);
        setProduct(tempProduct);
    }, [ params.id ]);
    
    useEffect(() => {

        const tempIsFavourite = favourites.find(f => f ===  product.id_producto );
        setIsFavourite(tempIsFavourite ? true : false);
    }, [favourites, product]);

    const addProductToFavourites = (e: any, productID: string ) => {

        e.preventDefault();
        addToFavourites(productID);

    }

    const addProductToCart = (e: any, productID: string ) => {

        e.preventDefault();


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
                                        <IonIcon className="productCardAction"  color={ isFavourite ? "danger" : "medium" } icon={ isFavourite ? heart : heartOutline } onClick={ e => addProductToFavourites(e,(product?.id_producto ?? "")) } />
                                        <IonIcon style={{ position: "absolute", display: "none" }} id={ `lugar_producto_favorito_${ params.id }` } className="productCardAction  animate__animated" color="danger" icon={ heart } />
                                    </div>
                                    <IonText color="dark" style={{maxWeight:'250px'}}><h3 className="ion-text-wrap"><b>{ product.nombre_producto }</b></h3></IonText>
                                    <img className="productImage" src={ product?.imagen??"img-no-encontrado.png"} alt="product pic" />
                                    <IonText color="dark"><h4><b>Marca</b></h4></IonText>
                                    <p className="ion-text-wrap">{ product.marca }</p>
                                    <IonText color="dark"><h4><b>Descripción del Producto</b></h4></IonText>
                                    <div className="productDescription">
                                        <p className="ion-text-wrap custom-scrollbar">{product.descripcion}</p>
                                    </div>
                                </IonCardHeader>

                                <IonCardContent className="categoryCardContent">
                                    
                                    <div className="productPrice">
                                    <IonButton className="auto-width-button" color="light" >
                                { product.precio?.toLocaleString('es-ES').concat(' ₲') }
                            </IonButton>
                            
                            {
                            product.cantidad && product.cantidad - productoEnCompra > 0 && (
                                <>
                                    <IonButton className="auto-width-button" color="dark" onClick={e => addProductToCart(e, params.id)} >
                                        <IonIcon ref={cartRef} icon={cartOutline}/>&nbsp;&nbsp;Agregar al Carrito
                                    </IonButton>
                                    <IonIcon ref={cartRef} icon={ cart } color="dark" style={{ position: "absolute", display: "none", fontSize: "3rem" }}/>
                                </>
                                )
                            }
                            {product.cantidad && (
                                <IonButton className="auto-width-button" color={product.cantidad - productoEnCompra>1?'tertiary':'danger'}>
                                    {product.cantidad - productoEnCompra } restantes
                                </IonButton>
                            )
                            }

                                        <IonIcon icon={ cart } color="dark" style={{ position: "absolute", display: "none", fontSize: "3rem" }} id={ `lugar_carrito_${ product.id_producto }` } className="animate__animated" />
                                            
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        </IonRow>

                        <IonRow className="ion-text-center">
                            <IonCol size="12">
                                <IonCardSubtitle>Más Productos...</IonCardSubtitle>
                            </IonCol>
                        </IonRow>

                        <IonRow>
                            { products.map((otro, index) => {

                                if ((otro.id_producto !== product.id_producto) && index < 4) {

                                    return (

                                        <ProductCard key={`similar_product_${index}`} product={otro} index={index} cartRef={cartRef} editarProducto={()=>{
                                            logs(`Vaya a la página principal para editar ${product.nombre_producto}`, 3000);
                                        }}/>
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