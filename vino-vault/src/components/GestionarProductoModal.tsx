import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Producto } from "../data/types";
import { IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonContent, IonItem, IonLabel, IonInput, IonImg, InputChangeEventDetail, IonGrid, IonRow, IonButtons } from "@ionic/react";
import { cameraOutline, closeOutline, searchOutline } from "ionicons/icons";
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { IonInputCustomEvent } from '@ionic/core';
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { LoadingContext } from "../contexts/LoadingContext";

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
                <IonToolbar>
                    <IonTitle>Editar Producto</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="danger" onClick={()=>dismiss()}>
                            <IonIcon icon={closeOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <>
                {
                    
                    (!mostrarScanner)?(
                        <IonGrid className="ion-padding">
                            <form  hidden={mostrarScanner}  onSubmit={async (e: React.FormEvent)=>{
                            e.preventDefault();
                            await handleAccion(producto).then(res=>{
                                if(res){

                                    console.log(res);
                                }
                            }).catch(err=>{
                                console.log(err);                        
                            })
                            dismiss();}}>
                                
                                <IonRow>
                                    <IonItem>
                                        <IonInput label="Nombre del Producto" labelPlacement="floating" value={producto.nombre_producto} onIonInput={(e: any) => handleProducto('nombre_producto', e.target.value)} />
                                    </IonItem>
                                </IonRow>
                                <IonRow>
                                    <IonItem>
                                        <IonInput label="Descripción del Producto" labelPlacement="floating" value={producto.descripcion} onIonInput={(e: any) => handleProducto('descripcion', e.target.value)} />
                                    </IonItem>
                                </IonRow>
                                <IonRow>
                                    <IonItem>
                                        <IonInput label="Precio del Producto" min='0' labelPlacement="floating" required={true} type="number" value={producto.precio?.toString()} onIonInput={(e: any) => handleProducto('precio', parseInt(e.target.value, 10))} />
                                    </IonItem>
                                </IonRow>
                                <IonRow>
                                    <IonItem>
                                        <IonInput label="Cantidad del Producto" min='0' labelPlacement="floating" required={true} type="number" value={producto.cantidad?.toString()} onIonInput={(e: any) => handleProducto('cantidad', parseInt(e.target.value, 10))} />
                                    </IonItem>
                                </IonRow>
                                <IonRow>
                                    <IonItem>
                                        <IonLabel slot="floating">Imagen</IonLabel>
                                        <IonButton onClick={buscarFoto}>Cambiar Imagen</IonButton>
                                        {
                                            producto.imagen?(
                                                <IonImg 
                                                src={`data:image/png;base64,${producto.imagen.replace("data:image/png;base64,",'')}`} />
                                            ):<>&nbsp;&nbsp;No hay imagen</>
                                        }

                                    </IonItem>
                                </IonRow>
                                <IonRow>
                                    <IonButton expand="block" type='submit'>
                                        Aceptar
                                    </IonButton>
                                </IonRow>
                            </form>
                        </IonGrid>
                    ):null
                }
                
                {
                    (mostrarScanner)? (
                        <>
                            <form hidden={!mostrarScanner} onSubmit={async (e)=> {
                                e.preventDefault();
                                
                                if(handleAccionComplementaria){
                                    await handleAccionComplementaria(producto).then((res)=>{
                                        if(res){
                                            console.log(res);
                                            const resProd = {...res as Producto};
                                            setProducto(resProd);
                                            
                                        } else {
                                            console.log('error');
                                        }
                                    }).catch(err=>{
                                        console.log('Error potente',err);
                                    }).finally(()=>{
                                        setMostrarScanner(false);
                                    })
                                }
                            }}>
                                <IonItem>
                                    <IonInput value={scannerResult}  required={true} minlength={11} maxlength={13} onIonInput={async (e:IonInputCustomEvent<InputChangeEventDetail>)=>{
                                        const valor = e.target.value;
                                        if(valor){
                                            setScannerResult(valor.toString())
                                            handleProducto('ean',valor);
                                        }
                                    }} 
                                    label="EAN para buscar en la Web" labelPlacement="floating"  placeholder="No hay busquedas..." ></IonInput>
                                    
                                </IonItem>
                                
                                <IonItem>
                                    <IonLabel hidden={!(scannerResult==="")} >Revise si el código está correcto.</IonLabel>
                                </IonItem>

                                <IonItem>
                                    <IonButton onClick={scanBarcode} color="dark">
                                        <IonIcon icon={cameraOutline} />
                                    </IonButton>
                                    <IonButton hidden={!handleAccionComplementaria} type="submit">
                                        <IonIcon icon={searchOutline}/>
                                    </IonButton>
                                    <IonButton onClick={()=>setMostrarScanner(!mostrarScanner)} color="danger">
                                        <IonIcon icon={closeOutline}/>
                                    </IonButton>
                                </IonItem>
                            </form>
                        </>
                        
                    ):null
                    
                }
                
                </>
            </IonContent>
            </>
    );
};

export default GestionarProductoModal;
