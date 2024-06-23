import { IonButton, IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonToggle, IonButtons, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonFooter, IonFab, IonFabButton, IonAlert, useIonToast, useIonAlert } from "@ionic/react";
import { addOutline, chevronBackOutline, closeOutline, createOutline, sendOutline, trashOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import './CartProducts.css'
import { fetchPersonas } from "../data/fetcher";
import { PersonasStore } from "../data/PersonasStore";
import { Persona } from "../data/types";
import GestionarUsuarioModal from "../components/GestionarUsuarioModal";

const UserSettings: React.FC = () => {
    
    const personas = PersonasStore.useState(s=>s.personas);
    const [personaList, setPersonaList] = useState<Persona[]>([]);
    const [personaEditar, setPersonaEditar] = useState<Persona>({admin:false, creado:false})
    const [personasActualizar, setPersonasActualizar] = useState<Persona[]>([]);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [logs] = useIonToast();
    const [alert] = useIonAlert();

    useEffect(()=>{
        if(!(personas.length>0)){
            fetchPersonas().then(res=>{
                if(res.length>0){
                    PersonasStore.update(s=>{
                        s.personas = res;
                    })
                }
            });
        }
    }, [])

    useEffect(()=>{
        setPersonaList(personas);
    },[personas]);

    useEffect(()=>{
        const personasActNew:Persona[]=[];
        personas.forEach((p,i)=>{
            const personaRes = personaList[i];
            const esIgual = JSON.stringify(p) === JSON.stringify(personaRes);
            if(!esIgual){
                personasActNew.push(personaRes);
            }
        });
        setPersonasActualizar(personasActNew);
        
    },[personaList])

    const handleDeleteUser = (persona: Persona) => {
        alert(`¿Borrar al Usuario ${persona.usuario}?`,
            [
                {
                    text:'Si', handler:()=>{
                        logs('Borrao',3000)
                    }
                },
                {
                    text:'No',
                    role:'cancel'
                }
            ]
        );
    };

    
    const handlePersonaEditar = (persona:Persona)=>{
        
        setPersonaEditar(persona);
        setMostrarEditar(true);
    }

    const handleEditarModal = (persona:Persona) => {
        const personaActual = personaList.filter(p=>p.id_usuario===persona.id_usuario)[0];
        if(JSON.stringify(personaActual)!==JSON.stringify(persona)){
            setPersonasActualizar([...personasActualizar, persona]);
        } else {
            logs("No hubo ningún cambio.",3000);
        }
    }
    const handleActualizar = ()=>{
        console.log(personasActualizar);
        
    }

    return (
        <IonPage>
            <IonHeader>
				<IonToolbar>
                    <IonButtons slot="start">
                        <IonButton color="dark" routerLink="/" routerDirection="back">
                            <IonIcon color="dark" icon={ chevronBackOutline } />&nbsp;Ver Productos
                        </IonButton>
                    </IonButtons>
					<IonTitle>Ajustes de Usuarios</IonTitle>
				</IonToolbar>
			</IonHeader>
            <IonContent fullscreen>
                <IonGrid className="ion-align-items-center ion-justify-content-center">
                    <IonRow>
                        <IonCol className="ion-margin-horizontal">
                            <IonLabel className="ion-padding-start ion-text-wrap">
                                <h2><strong>Nombre</strong></h2>
                            </IonLabel>
                        </IonCol>
                        <IonCol className="ion-margin-horizontal">
                            <IonLabel className="ion-padding-start ion-text-wrap">
                                <h2><strong>Administrador</strong></h2>
                            </IonLabel>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonList>
                    {personaList.map((user, index) => (
                        <IonItemSliding key={index} className="cartSlider">
                        <IonItem lines="none" detail={ false } className="cartItem ">
                            <IonGrid className="ion-align-items-center ion-justify-content-center">
                                <IonRow>
                                    <IonCol className="ion-margin-horizontal">
                                        <IonLabel className="ion-padding-start ion-text-wrap"><h4>{user.usuario}</h4></IonLabel>
                                    </IonCol>
                                    <IonCol className="ion-margin-horizontal">
                                        <IonToggle aria-label="Es Admin" checked={user.admin} disabled/>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonItem>
                        <IonItemOptions side="end">
                            <IonItemOption color="light" style={{ paddingLeft: "1rem", paddingRight: "1rem" }} onClick={() =>handlePersonaEditar(user)}>
                                <IonIcon icon={createOutline} />
                            </IonItemOption>
                            <IonItemOption color="danger" style={{ paddingLeft: "1rem", paddingRight: "1rem" }} onClick={() => handleDeleteUser(user)}>
                                <IonIcon icon={trashOutline} />
                            </IonItemOption>
                        </IonItemOptions>
                    </IonItemSliding>
                    ))}
                </IonList>
                <IonFab id="agregar" vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton color="dark">
                        <IonIcon icon={addOutline} />
                    </IonFabButton> 
                </IonFab>
                <GestionarUsuarioModal isOpen={mostrarEditar} accionTitle="Editar Persona" valorInicial={personaEditar} handleAceptar={handleEditarModal} onDidDismiss={()=>setMostrarEditar(false)} dismiss={()=>setMostrarEditar(false)}/>
            </IonContent>
            <IonFooter className="cartFooter">
                ({personasActualizar.length>0 && (
                    <div className="cartCheckout">
                    <IonRow>
                        <IonCol>
                            <IonButton id="actualizar" color="dark" >
                                <IonIcon icon={ sendOutline } />&nbsp;Aceptar cambios ({personasActualizar.length})
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton id="cancelar" color="danger" >
                                <IonIcon icon={ closeOutline } />&nbsp;Cancelar cambios
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    <IonAlert trigger="actualizar" header="Actualizar Usuarios"
                    subHeader="¿Realmente desea actualizar a los usuarios?"
                    buttons={[
                        {text:'Si',handler:handleActualizar},
                        {text:'No', role:"cancel"}
                    ]}
                    />
                    <IonAlert trigger="cancelar" header="Cancelar cambios en Usuarios"
                    subHeader="¿Realmente desea cancelar los cambios a los usuarios?"
                    buttons={[
                        {text:'Si',handler:()=>{setPersonasActualizar([])}},
                        {text:'No', role:"cancel"}
                    ]}
                    />
                </div>
                )})

            </IonFooter>
        </IonPage>
    );
};

export default UserSettings;
