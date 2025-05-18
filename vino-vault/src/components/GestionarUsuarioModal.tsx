import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonRow, IonTitle, IonToggle, IonToolbar, ToggleChangeEventDetail } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { Persona } from '../data/types';
import { useEffect, useState } from "react";
import { InputInputEventDetail, IonInputCustomEvent } from "@ionic/core";

export interface GestionarUsuarioModalProps  {
    handleAceptar:(persona: Persona) => void,
    accionTitle:'Editar'|'Agregar',
    valorInicial?:Persona,
    dismiss:()=>void
}

const GestionarUsuarioModal: React.FC<GestionarUsuarioModalProps> = ({handleAceptar, valorInicial, accionTitle, dismiss}) => {
    const valorVacio:Persona = {admin:false};
    const [persona, setPersona] = useState<Persona>(valorInicial??valorVacio);

    useEffect(()=>{
        setPersona(valorInicial??valorVacio);
    },[valorInicial]);

    const handlePersona = (
        e: IonInputCustomEvent<InputInputEventDetail> | any
    ) => {
        const { name, value, checked } = e.target;
        const newValue = 'checked' in e.target ? checked : value;
        setPersona({ ...persona, [name]: newValue });
    };

    return(
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{accionTitle} Usuario</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="danger" onClick={()=>dismiss()}>
                            <IonIcon icon={closeOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <form onSubmit={async (e:React.FormEvent)=>{
                    e.preventDefault();
                    handleAceptar(persona);
                    dismiss();
                }}>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <IonItem>
                                    <IonInput name="usuario" required={(accionTitle==="Agregar")} labelPlacement="floating" label="Nombre de Usuario" placeholder="Ingrese el nombre de Usuario" value={persona.usuario} onIonInput={handlePersona}/>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonItem>
                                    <IonInput name="pseudoclave" required={(accionTitle==="Agregar")} labelPlacement="floating" label="Contraseña" placeholder="Ingrese la Contraseña" value={persona.pseudoclave} onIonInput={handlePersona}/>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonItem>
                                    <IonToggle name="admin"  labelPlacement="start" alignment="center" checked={persona.admin} onIonChange={handlePersona}>
                                        ¿Requiere permisos de Administrador?
                                    </IonToggle> 
                                </IonItem>
                            </IonCol>
                        </IonRow>
                        <IonRow className="ion-padding">
                            <IonCol>
                                <IonButton color="dark" expand="full" type="submit">
                                    Guardar Cambios
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </form>
            </IonContent>
        </>
    );
}

export default GestionarUsuarioModal;