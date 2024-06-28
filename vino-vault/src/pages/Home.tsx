import { IonAlert, IonBadge, IonButton, IonButtons, IonCol, IonContent, IonFab, IonFabButton, IonFabList, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonLabel, IonModal, IonNote, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSearchbar, IonTitle, IonToolbar, RefresherEventDetail, useIonModal } from "@ionic/react";
import { addOutline, cart, cashOutline, exit, heart, personCircleOutline, searchOutline, settingsOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/ProductCard.tsx";
import { CartStore } from "../data/CartStore.ts";
import { ProductStore } from "../data/ProductStore.ts";
import "./Home.css";
import { Producto } from "../data/types.ts";
import React from "react";
import { FavouritesStore } from "../data/FavouritesStore.ts";
import { fetchData, fetchProductoAgregar, fetchProductoCodigoBarra, fetchProductoModificar } from "../data/fetcher.ts";
import { useAutenticacion } from "../contexts/AutenticacionContext.tsx";
import GestionarProductoModal, { GestionarProductoModalProps } from "../components/GestionarProductoModal.tsx";

const Home : React.FC = () => {

    
    const cartRef = useRef<HTMLIonIconElement>(null);
    const products = ProductStore.useState(s=>s.products);
    const favoritos = FavouritesStore.useState(s=>s.product_ids);
    const shopCart = CartStore.useState(s => s.product_ids);
    const [ searchResults, setsearchResults ] = useState<Producto[]>([]);
    const [ amountLoaded, setAmountLoaded ] = useState(6);
    const [productoEditar, setProductoEditar] = useState<Producto>({cantidad:0,precio:0});
    const {logout} = useAutenticacion();
    const [requiereScanner, setRequiereScanner] = useState(false);
    const accionRef = useRef<(p:Producto) => Promise<any>>();
    const accionBusRef = useRef<(p:Producto) => Promise<Producto>>();
    const [mostrar, cerrar] = useIonModal(GestionarProductoModal, {
        dismiss: ()=>cerrar(),
        handleAccion: (producto: Producto) => accionRef.current && accionRef.current(producto),
        productoInicial:{...productoEditar},
        requiereScanner:requiereScanner,
        handleAccionComplementaria: (producto: Producto) => accionBusRef.current && accionBusRef.current(producto),
    } as GestionarProductoModalProps )


    useEffect(()=>{
        
        if(!localStorage.getItem('productos')){
            fetchData();
        }
    }, []);

    useEffect(()=>{
        setsearchResults(products);
    },[products]);

    useEffect(() => {
        if(amountLoaded>=0){
            const productosTop = products?.map((p,i)=>{
                if(i<=amountLoaded){
                    return p;
                }
                return null
            }).filter(p=>p!=null);
            setsearchResults(productosTop);
        }
    }, [amountLoaded]);

    const updateProductos = async (event: CustomEvent<RefresherEventDetail>)=> {
       await fetchData().finally(()=>event.detail.complete());
    }


    const handleEditarProducto = async (producto:Producto)=> {
        const keys:(keyof Producto)[] = ["cantidad", "descripcion", "id_producto", "ean", "marca", "nombre_producto",
            "precio", "imagen"
        ]
        const productoNuevo = {...producto};
        for (const key of keys) {
            if (productoNuevo[key] === productoEditar[key] && key !='id_producto') {
                productoNuevo[key] = undefined;
            }
        }
        await fetchProductoModificar(productoNuevo)
    }

    const fetchMore = async (e:any) => {
		setAmountLoaded(prevAmount => (prevAmount + 6));
		e.target.complete();
	}

    const editarProducto = (e: any, producto:Producto) =>{
        e.preventDefault();
        e.stopPropagation();
        setProductoEditar(producto);
        setRequiereScanner(false);
        accionRef.current = handleEditarProducto;
        accionBusRef.current = undefined;
        mostrarModal();
    }

    const mostrarModal = ()=>{
        mostrar({
            onDidDismiss: async ()=>{
                setProductoEditar({cantidad:0,precio:0});
                await fetchData();
            }
        });
    }

    const agregarProducto = (e: any) =>{
        e.preventDefault();
        e.stopPropagation();
        setProductoEditar({cantidad:0,precio:0});
        accionBusRef.current = fetchProductoCodigoBarra
        setRequiereScanner(true);
        accionRef.current = fetchProductoAgregar;
        mostrarModal();
    }

    const search = async (e:React.KeyboardEvent<HTMLIonSearchbarElement>) => {
        const searchVal = e.currentTarget.value;
        if (searchVal !='' && searchVal && searchVal!=undefined) {
            const tempResults :Producto[]|undefined= products?.filter(p => p.nombre_producto?.toLowerCase().includes((searchVal?searchVal.toLowerCase():'')));
            if (tempResults!==undefined){
                setsearchResults(tempResults);
            }
        }else {
            setsearchResults(products)
        }
    }

   

    return (

        <IonPage id="category-page" className="categoryPage">
            <IonHeader>
				<IonToolbar>
					<IonTitle>Productos</IonTitle>
                    <IonButtons slot="end">
						<IonBadge color="danger">
                            { favoritos.length }
                        </IonBadge>
						<IonButton color="danger" routerLink="/favourites">
							<IonIcon icon={ heart } />
						</IonButton>
						<IonBadge color="dark">
                            { shopCart.length }
                        </IonBadge>
						<IonButton color="dark" routerLink="/cart">
							<IonIcon icon={ cart } />
						</IonButton>
                        <IonButton id="btn-cerrar-sesion" title="Salir" color="danger">
                            <IonIcon icon={exit} />
                        </IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
                <IonRefresher slot="fixed" pullFactor={0.5} pullMin={100} pullMax={200} onIonRefresh={updateProductos}>
                    <IonRefresherContent >
                    </IonRefresherContent>
                </IonRefresher>
                <IonSearchbar className="search" onKeyUp={ search } placeholder="Intenta con 'Vino'" searchIcon={ searchOutline } animated={ true } />
                
                <IonGrid>
                    <IonRow className="ion-text-center">
                        <IonCol size="12">
                            <IonNote>{ (searchResults && searchResults.length) } { (searchResults.length > 1 || searchResults.length === 0) ? " productos encontrados." : " producto encontrado." } </IonNote>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        { searchResults && searchResults.map((product, index) => {
                            if ((index <= amountLoaded)) {
                                return (
                                    <ProductCard key={ `producto_${ index }`} product={ product } index={ index } cartRef={ cartRef } editarProducto={editarProducto}  />
                                );
                            }
                            return null;
                        }).filter(o=>o!=null)
                        }
                    </IonRow>
                </IonGrid>
                <IonInfiniteScroll threshold="100px" onIonInfinite={ fetchMore }>
                <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Cargando más..."/>
                </IonInfiniteScroll>
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton color="dark">
                        <IonIcon icon={settingsOutline} />
                    </IonFabButton> 
                    <IonFabList side="top">
                        <IonFabButton color="dark" onClick={(e)=>agregarProducto(e)} title="Registrar Productos">
                            <IonIcon icon={addOutline} />
                        </IonFabButton>
                        <IonFabButton color="dark" routerLink="/ajustes-usuario" title="Ajustes de Usuario">
                            <IonIcon icon={personCircleOutline} />
                        </IonFabButton>
                        <IonFabButton color="dark" routerLink="/ventas" title="Ventas">
                            <IonIcon icon={cashOutline} />
                        </IonFabButton>
                    </IonFabList>
                </IonFab>
            </IonContent>
            <IonAlert trigger="btn-cerrar-sesion" header="Cerrar Sesión" message="¿Realmente desea cerrar sesión?"
            buttons={[
                {text:'Si',handler:logout},
                {text:'No', role:"cancel"}
            ]}
            />
        </IonPage>
    );
}

export default Home;