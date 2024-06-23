import React from "react";
import { Producto } from "../data/types";
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonContent, IonItem, IonLabel, IonInput } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

interface AgregarProductoModalProps {
    mostrarEditar: boolean;
    setProductoEditar: (value: React.SetStateAction<Producto>) => void;
    setMostrarEditar: (value: React.SetStateAction<boolean>) => void;
    handleProducto: (campo: keyof Producto, value: any) => void;
    productoEditar:Producto
}

const AgregarProductoModal: React.FC<AgregarProductoModalProps> = (props) => {
    const { mostrarEditar, setProductoEditar, setMostrarEditar, handleProducto, productoEditar } = props;

   
    const handleEditar = async () =>{

        setMostrarEditar(!mostrarEditar);
    }

    return (
        <IonModal isOpen={mostrarEditar} onDidDismiss={()=>{
            setProductoEditar({cantidad:0, precio:0});
            setMostrarEditar(false);
        }}>
            <IonHeader>
                <IonToolbar color="dark">
                <IonTitle>Editar Producto</IonTitle>
                <IonButton slot="end" onClick={()=>setMostrarEditar(!mostrarEditar)}>
                    <IonIcon icon={closeOutline} />
                </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonLabel position="floating">EAN</IonLabel><br/>
                    <IonInput aria-label="EAN o Código de Barra" value={productoEditar.ean} onIonInput={(e: any) => handleProducto('ean', e.target.value)} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Nombre Producto</IonLabel><br/>
                <IonInput aria-label="Nombre del Producto" value={productoEditar.nombre_producto} onIonInput={(e: any) => handleProducto('nombre_producto', e.target.value)} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Precio</IonLabel><br/>
                <IonInput aria-label="Precio del Producto" type="number" value={productoEditar.precio?.toString()} onIonInput={(e: any) => handleProducto('cantidad', parseInt(e.target.value, 10))} />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Imagen</IonLabel><br/>
                </IonItem>
                <IonButton expand="block" onClick={handleEditar}>
                    Guardar Cambios
                </IonButton>
            </IonContent>
            </IonModal>
    );
};

export default AgregarProductoModal;
