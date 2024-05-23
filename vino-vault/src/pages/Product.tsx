import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { addCircle, arrowRedoOutline, cart, cartOutline, chevronBackOutline, heart, heartOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/ProductCard.tsx";
import { addToCart, CartStore } from "../data/CartStore.ts";
import { addToFavourites, FavouritesStore } from "../data/FavouritesStore.ts";
import { ProductStore } from "../data/ProductStore.ts";

import "./Product.css";
import React from "react";
import { Product as ProductType, ProductCategory } from "../data/types.ts";
import { useParams } from "react-router-dom";

const Product : React.FC = () => {

    const params= useParams() as any;
    const cartRef = useRef<HTMLIonIconElement>(null);
    const products = ProductStore.useState(s => s.products);
    const favourites = FavouritesStore.useState(s => s.product_ids);
    const [ isFavourite, setIsFavourite ] = useState(false);
    const shopCart = CartStore.useState(s => s.product_ids);
    const [ product, setProduct ] = useState<ProductType>({});
    const [ category, setCategory ] = useState<ProductCategory>({});

    useEffect(() => {

        const categorySlug = params.slug;
        const productID = params.id;
        const tempCategory = products.filter(p => p.slug === categorySlug)[0];
        console.log(tempCategory.products);
        
        const tempProduct = tempCategory.products.filter(p => p.id.toString() === productID)[0];
        

        const tempIsFavourite = favourites.find(f => f === `${ categorySlug }/${ productID }`);

        setIsFavourite(tempIsFavourite ? true : false);
        setCategory(tempCategory);
        setProduct(tempProduct);
    }, [ params.slug, params.id ]);
//error de tipo2
    useEffect(() => {

        const tempIsFavourite = favourites.find(f => f === `${ category.slug }/${ product.id }`);
        setIsFavourite(tempIsFavourite ? true : false);
    }, [favourites, product]);

    const addProductToFavourites = (e: any, categorySlug: string , productID: number ) => {

        e.preventDefault();
        addToFavourites(categorySlug, productID);


        //document.getElementById(`placeholder_favourite_product_${ categorySlug }_${ productID }`).style.display = "";
        //document.getElementById(`placeholder_favourite_product_${ categorySlug }_${ productID }`).classList.add("animate__fadeOutTopRight");
    }

    const addProductToCart = (e: any, categorySlug: string , productID: number ) => {

        e.preventDefault();

        //document.getElementById(`placeholder_cart_${ categorySlug }_${ productID }`).style.display = "";
       // document.getElementById(`placeholder_cart_${ categorySlug }_${ productID }`).classList.add("animate__fadeOutUp");

        setTimeout(() => {

            cartRef.current?.classList.add("animate__tada");
            addToCart(categorySlug, productID);

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
                        <IonButton color="dark" title={ category.name } routerLink={ `/category/${ category.slug }` } routerDirection="back">
                            <IonIcon color="dark" icon={ chevronBackOutline } />&nbsp;{ category.name }
                        </IonButton>
                    </IonButtons>

                    <IonTitle>View Product</IonTitle>

                    <IonButtons slot="end">
                        <IonBadge color="dark">
                            { shopCart.length }
                        </IonBadge>
						<IonButton color="dark" routerLink="/cart">
							<IonIcon ref={ cartRef } className="animate__animated" icon={ cart } />
						</IonButton>
                
                            
                        <IonButtons slot="end">
                        
                        </IonButtons>
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
                                        <IonIcon className="productCardAction"  color={ isFavourite ? "danger" : "medium" } icon={ isFavourite ? heart : heartOutline } onClick={ e => addProductToFavourites(e, (category.slug?category.slug:''),
                                            (product.id?product.id:0)) } />
                                        <IonIcon style={{ position: "absolute", display: "none" }} id={ `placeholder_favourite_product_${ category.slug }_${ params.id }` } className="productCardAction  animate__animated" color="danger" icon={ heart } />
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
                                            (category.slug?category.slug:''),
                                            (product.id?product.id:-1)) }>
                                            <IonIcon icon={ cartOutline } />&nbsp;&nbsp;Add to Cart
                                        </IonButton>

                                        <IonIcon icon={ cart } color="dark" style={{ position: "absolute", display: "none", fontSize: "3rem" }} id={ `placeholder_cart_${ category.slug }_${ product.id }` } className="animate__animated" />
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
                            { (category && category.products) && category.products.map((similar, index) => {

                                if ((similar.id !== product.id) && product.image && index < 4) {

                                    return (

                                        <ProductCard key={ `similar_product_${ index }`} product={ similar } index={ index }  cartRef={ cartRef } category={ category } />
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