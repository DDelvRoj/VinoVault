import React, { FormEvent, useEffect, useState } from "react";
import { Producto } from "../data/types";
import { IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonContent, IonItem, IonLabel, IonInput, IonImg, InputChangeEventDetail } from "@ionic/react";
import { closeOutline, searchOutline } from "ionicons/icons";
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { IonInputCustomEvent } from '@ionic/core';
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export interface GestionarProductoModalProps  {
    dismiss: ()=>void;
    handleAccion: (producto:Producto)=>Promise<any>;
    handleAccionComplementaria?:(producto:Producto)=>Promise<any>;
    productoInicial?:Producto;
    requiereScanner?:true;
}

const GestionarProductoModal: React.FC<GestionarProductoModalProps> = ({dismiss, handleAccion, productoInicial, handleAccionComplementaria, requiereScanner}) => {
   
    const [producto, setProducto] = useState<Producto>({});
    const [mostrarScanner, setMostrarScanner] = useState(false);
    const [scannerResult, setScannerResult] = useState<string>('');
    
    useEffect(()=>{
        if(requiereScanner){
            setMostrarScanner(requiereScanner)
        }
    },[requiereScanner])

    useEffect(()=>{
        if(productoInicial){
            setProducto(productoInicial);
        }
    },[productoInicial]);

    const handleProducto = (campo: keyof Producto, value:any) => {
        setProducto({ ...producto, [campo]: value});
    };

    const buscarFoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Base64,
            source: CameraSource.Photos,

            quality: 100
        });
        if(photo){
            handleProducto('imagen',photo.base64String);
        }
    }

    const scanBarcode = async () => {
        const result = await CapacitorBarcodeScanner.scanBarcode({
          hint: CapacitorBarcodeScannerTypeHint.ALL
        });
        setScannerResult(result.ScanResult);
        handleProducto('ean',result.ScanResult);
    };

    return (
        <>
            <IonHeader>
                <IonToolbar color="dark">
                <IonTitle>Editar Producto</IonTitle>
                <IonButton slot="end" onClick={()=>dismiss()}>
                    <IonIcon icon={closeOutline} />
                </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form onSubmit={async (e: React.FormEvent)=>{
                    e.preventDefault();
                    await handleAccion(producto).then(res=>{
                        if(res){
                            console.log(res);
                        }
                    }).catch(err=>{
                        console.log(err);                        
                    })
                    dismiss();}}>
                {
                    
                    (!mostrarScanner) && (
                        <>
                            <IonItem>
                                <IonInput label="EAN o Código de Barra" labelPlacement="floating" value={producto.ean} onIonInput={(e: any) => handleProducto('ean', e.target.value)} />
                            </IonItem>
                            <IonItem>
                                <IonInput label="Nombre del Producto" labelPlacement="floating" value={producto.nombre_producto} onIonInput={(e: any) => handleProducto('nombre_producto', e.target.value)} />
                            </IonItem>
                            <IonItem>
                                <IonInput label="Descripción del Producto" labelPlacement="floating" value={producto.descripcion} onIonInput={(e: any) => handleProducto('descripcion', e.target.value)} />
                            </IonItem>
                            <IonItem>
                                <IonInput label="Precio del Producto" labelPlacement="floating" required={true} type="number" value={producto.precio?.toString()} onIonInput={(e: any) => handleProducto('precio', parseInt(e.target.value, 10))} />
                            </IonItem>
                            <IonItem>
                                <IonInput label="Cantidad del Producto" labelPlacement="floating" required={true} type="number" value={producto.cantidad?.toString()} onIonInput={(e: any) => handleProducto('cantidad', parseInt(e.target.value, 10))} />
                            </IonItem>
                            <IonItem>
                                <IonLabel slot="floating">Imagen</IonLabel>
                                <IonButton onClick={buscarFoto}>Cambiar Imagen</IonButton>
                                <IonImg src={(producto.imagen?`data:image/png;base64,${producto.imagen.replace("data:image/png;base64,",'')}`:'')} />

                            </IonItem>
                        </>
                    )
                }
                
                {
                    (mostrarScanner) && (
                        <>
                            <IonItem>
                                <div style={{marginTop: '5px'}}></div>
                                <br/>
                                <IonInput value={scannerResult} onIonInput={async (e:IonInputCustomEvent<InputChangeEventDetail>)=>{
                                    const valor = e.target.value;
                                    if(valor){
                                        setScannerResult(valor.toString())
                                        handleProducto('ean',valor);
                                    }
                                }} 
                                label="Resultado del Escáner" labelPlacement="floating" fill="outline" placeholder="No hay busquedas..." ></IonInput>
                                <IonButton onClick={scanBarcode} color="dark">Escanear Código</IonButton>
                                <IonButton hidden={!handleAccionComplementaria} onClick={async ()=>{
                                    if(handleAccionComplementaria){
                                        await handleAccionComplementaria(producto).then((res)=>{
                                            if(res){
                                                console.log(res);
                                                const resProd = {...res as Producto};
                                                setProducto(resProd);
                                                setMostrarScanner(false);
                                            } else {
                                                console.log('error');
                                            }
                                        }).catch(err=>{
                                            console.log('Error potente',err);
                                        })
                                    }
                                }}>
                                    <IonIcon icon={searchOutline}/>
                                </IonButton>
                                <IonButton onClick={()=>setMostrarScanner(!mostrarScanner)} color="danger">
                                    <IonIcon icon={closeOutline}/>
                                </IonButton>
                            </IonItem>
                            <IonItem>
                                <IonLabel hidden={!(scannerResult==="")} >Revise si el código está correcto.</IonLabel>
                            </IonItem>
                        </>
                        
                    )
                    
                }
                
                <IonButton expand="block" type='submit'>
                    Aceptar
                </IonButton>
                </form>
            </IonContent>
            </>
    );
};

export default GestionarProductoModal;
