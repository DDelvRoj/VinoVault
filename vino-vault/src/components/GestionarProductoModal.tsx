import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Producto } from "../data/types";
import { IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonContent, IonItem, IonLabel, IonInput, IonImg, InputChangeEventDetail, IonGrid, IonRow, IonButtons, IonCol, useIonToast } from "@ionic/react";
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
    const [alert] = useIonToast()
    
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
        await Camera.checkPermissions();
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
         await CapacitorBarcodeScanner.scanBarcode({
            scanInstructions:"Apunta bien porfa",
            hint: CapacitorBarcodeScannerTypeHint.ALL
        }).then(result=>{
            setScannerResult(result.ScanResult);
            handleProducto('ean',result.ScanResult);
        }).catch((err)=>{
            console.log(err);
            alert('Error al escanear.',2500);
        });
        
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
                                const dimensionCorrecta = scannerResult.length>=11;
                                if(handleAccionComplementaria && dimensionCorrecta ){
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
                                        alert("No se encontró el producto",2500);
                                    }).finally(()=>{
                                        setScannerResult('')
                                    });
                                }
                                if(!dimensionCorrecta){
                                    setScannerResult('');
                                }
                            }}>
                                <IonItem>
                                    <IonInput value={scannerResult} type="number" required minlength={11} maxlength={13} onIonInput={async (e:IonInputCustomEvent<InputChangeEventDetail>)=>{
                                        const valor = e.target.value;
                                        if(valor){
                                            setScannerResult(valor.toString())
                                            handleProducto('ean',valor);
                                        }
                                    }} 
                                    label="EAN para buscar en la Web" labelPlacement="floating"  placeholder="No hay busquedas..." ></IonInput>
                                    
                                </IonItem>
                                
                                <IonItem className={(scannerResult.length>=11 && scannerResult.length<=13?'ion-hide':'')}>
                                    <IonLabel color="danger" >Revise si el código está correcto. Debe tener entre 11 a 13 números.</IonLabel>
                                </IonItem>

                                <IonItem className="ion-justify-content-center">
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol>
                                                <IonButton onClick={scanBarcode} expand="full" color="dark">
                                                    Escanear <IonIcon className="ion-padding-start" icon={cameraOutline}  />
                                                </IonButton>
                                            </IonCol>
                                            <IonCol  hidden={!handleAccionComplementaria}>
                                                <IonButton type="submit" expand="full" >
                                                    Buscar <IonIcon className="ion-padding-start" icon={searchOutline}/>
                                                </IonButton>
                                            </IonCol>
                                            <IonCol>
                                                <IonButton onClick={()=>setMostrarScanner(!mostrarScanner)} color="danger" expand="full" >
                                                    Manual <IonIcon className="ion-padding-start" icon={closeOutline}/>
                                                </IonButton>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
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
