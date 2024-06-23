import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonTitle, IonToggle, IonToolbar, ToggleChangeEventDetail } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { Persona } from '../data/types';
import { useEffect, useState } from "react";
import { InputInputEventDetail, IonInputCustomEvent } from "@ionic/core";

interface GestionarUsuarioModalProps extends React.ComponentProps<typeof IonModal> {
    handleAceptar:(persona: Persona) => void,
    accionTitle:string,
    valorInicial?:Persona,
    dismiss:()=>void
}

const GestionarUsuarioModal: React.FC<GestionarUsuarioModalProps> = ({handleAceptar, valorInicial, accionTitle, dismiss, ...rest}) => {

    
    const [persona, setPersona] = useState<Persona>(valorInicial?valorInicial:{admin:false, creado:false});

    useEffect(()=>{
        setPersona(valorInicial?valorInicial:{admin:false, creado:false});
    },[valorInicial]);

    const handlePersona = (
        e: IonInputCustomEvent<InputInputEventDetail> | any
    ) => {
        const { name, value, checked } = e.target;
        const newValue = 'checked' in e.target ? checked : value;
        setPersona({ ...persona, [name]: newValue });
        console.log(persona);
    };

    return(
        <IonModal {...rest} onDidDismiss={()=>{
            setPersona({admin:false, creado:false});
        }}>
            <IonHeader>
                <IonToolbar color="dark">
                    <IonTitle>{accionTitle}</IonTitle>
                    <IonButton color="danger" slot="end" onClick={()=>dismiss()}>
                        <IonIcon icon={closeOutline} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonInput name="usuario" labelPlacement="floating" label="Nombre de Usuario" placeholder="Ingrese el nombre de Usuario" value={persona.usuario} onIonInput={handlePersona}/>
                </IonItem>
                <IonItem>
                    <IonInput name="pseudoclave" labelPlacement="floating" label="Contraseña (Dejar vacío si no es necesario)" placeholder="Ingrese la Contraseña" value={persona.pseudoclave} onIonInput={handlePersona}/>
                </IonItem>
                <IonItem>
                    <IonToggle name="admin"  labelPlacement="start" alignment="center" checked={persona.admin} onIonChange={handlePersona}>
                        ¿Requiere permisos de Administrador?
                    </IonToggle> 
                </IonItem>
                <br/>
                <IonButton color="dark" expand="block" onClick={()=>{
                    handleAceptar(persona);
                    dismiss();
                }}>
                    Guardar Cambios
                </IonButton>
            </IonContent>
        </IonModal>
    );
}

export default GestionarUsuarioModal;