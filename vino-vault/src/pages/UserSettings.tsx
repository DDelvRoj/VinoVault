import { IonButton, IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonToggle, IonButtons, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonFooter, IonFab, IonFabButton, IonAlert, useIonToast, useIonAlert, useIonModal } from "@ionic/react";
import { addOutline, chevronBackOutline, closeOutline, createOutline, sendOutline, trashOutline } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import './CartProducts.css'
import { fetchPersonas, fetchPersonasAgregar, fetchPersonasBorrar, fetchPersonasModificar } from "../data/fetcher";
import { PersonasStore } from "../data/PersonasStore";
import { Persona } from "../data/types";
import GestionarUsuarioModal, { GestionarUsuarioModalProps } from "../components/GestionarUsuarioModal";
import { SesionStore } from "../data/SesionStore";

const UserSettings: React.FC = () => {
    const miID = SesionStore.useState(s=>s.miSesion);
    const personas = PersonasStore.useState(s=>s.personas);
    const [personaList, setPersonaList] = useState<Persona[]>([]);
    const [personaEditar, setPersonaEditar] = useState<Persona>({admin:false})
    const [personasActualizar, setPersonasActualizar] = useState<Persona[]>([]);
    const [logs] = useIonToast();
    const [alert] = useIonAlert();
    const [accionTitle, setAccionTitle] = useState<"Editar"|"Agregar">('Editar');
    const accionRef = useRef<(persona:Persona)=>void>();
    const listaRef = useRef<{[key:string]:HTMLIonItemSlidingElement}>({})
    const [mostrar, cerrar] = useIonModal(GestionarUsuarioModal,
        {
            dismiss: ()=>cerrar(),
            accionTitle: accionTitle,
            valorInicial: personaEditar,
            handleAceptar: (persona:Persona) => accionRef.current && accionRef.current(persona)
        } as GestionarUsuarioModalProps
    );

    
    useEffect(()=>{
        cargarPersonas()
    }, []);

    useEffect(()=>{
        setPersonaList(personas.filter(p=>p.id_usuario!==miID.id_usuario));
    },[personas, miID]);

    const cargarPersonas = async () => {
        await fetchPersonas().then(res=>{
            if(res.length>0){
                PersonasStore.update(s=>{
                    s.personas = res;
                });
            }
        });
    }

    const cerrarItem = (id:string) => {
        if(listaRef.current && listaRef.current[id]){
            listaRef.current[id]?.closeOpened();
        }
    }

    const handleDeleteUser = (persona: Persona) => {
        cerrarItem(persona.id_usuario??'');
        alert(`¿Borrar al Usuario ${persona.usuario}?`,
            [
                {
                    text:'Si', handler: async ()=>{
                        if(persona.id_usuario){
                            await fetchPersonasBorrar(persona.id_usuario);
                            await cargarPersonas();
                        }
                    }
                },
                {
                    text:'No',
                    role:'cancel'
                }
            ]
        );
    };

    const handlePersonaAgregar = ()=>{
        setPersonaEditar({admin:false});
        const agregarPersona = async (persona:Persona) => {
            await fetchPersonasAgregar(persona).then(res=>{
                console.log(res.msj);
                cargarPersonas();
                logs(res.msj,3000);
            }).catch((err)=>{
                console.log(err);
                
                logs(err, 3000);
            })
        }
        accionRef.current = agregarPersona;
        setAccionTitle("Agregar");
        mostrarModal();


    }
    
    const handlePersonaEditar = (persona:Persona)=>{
        cerrarItem(persona.id_usuario??'');
        setPersonaEditar(persona);
        const agregarPersona = (persona:Persona)=>{
            const nuevaListaActualizar = [...personasActualizar];
            const indicePersonaSiExiste = nuevaListaActualizar.findIndex(p=>p.id_usuario===persona.id_usuario);
            if(indicePersonaSiExiste>-1){
                nuevaListaActualizar[indicePersonaSiExiste] = persona;
            } else {
                nuevaListaActualizar.push(persona);
            }
            const nuevaLista = [...personaList];
            nuevaListaActualizar.forEach((p)=>{
                nuevaLista[personaList.findIndex(pc=>pc.id_usuario===p.id_usuario)]=p;
            })
            setPersonasActualizar(nuevaListaActualizar);
            setPersonaList(nuevaLista);
        }
        setAccionTitle("Editar");
        accionRef.current = agregarPersona;
        logs('Campo Usuario o Contraseña puede dejarse vacío si no requiere cambios.',3000);
        mostrarModal();
    }

    const mostrarModal = () => {
        mostrar({
            onDidDismiss: ()=>{
                setPersonaEditar({admin:false})
            }
        });
    }

    const handleActualizar = async ()=>{
        personaList.forEach(async p => {
            await fetchPersonasModificar(p).then((res)=>{
                console.log(res);
            }).catch(error=>{
                console.log(error);
            });
        });
        setPersonasActualizar([]);
    }

    const handleIntentarCancelar = () => {
        alert(`¿Cancelar las actualizaciones?`,
            [
                {
                    text:'Si', handler:()=>{
                        setPersonasActualizar([]);
                        setPersonaList(personas);
                    }
                },
                {
                    text:'No',
                    role:'cancel'
                }
            ]
        );
    }

    const handleIntentarActualizar = () => {
        alert(`¿Está seguro de querer actualizar ${personaList.length} elemento/s?`,[
            {text:'Si',handler:handleActualizar},
            {text:'No', role:"cancel"}
        ])
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
                <IonList >
                    {personaList.map((user) => (
                        <IonItemSliding key={user.id_usuario} 
                        ref={el => {
                            if(el && user.id_usuario){
                                listaRef.current[user.id_usuario] = el;
                            }
                        }}
                        className="cartSlider">
                        <IonItem lines="none" detail={ false } className="cartItem " >
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
                <IonFab vertical="bottom" horizontal="end" slot="fixed" onClick={()=>handlePersonaAgregar()}>
                    <IonFabButton color="dark"><IonIcon icon={addOutline}/></IonFabButton>
                </IonFab>
                
            </IonContent>
            <IonFooter className="cartFooter">
                ({personasActualizar.length>0 && (
                    <div className="cartCheckout">
                    <IonRow>
                        <IonCol>
                            <IonButton  color="dark" onClick={()=>handleIntentarActualizar()} >
                                <IonIcon icon={ sendOutline } />&nbsp;Aceptar cambios ({personasActualizar.length})
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton color="danger" onClick={() => handleIntentarCancelar()}>
                                <IonIcon icon={ closeOutline } />&nbsp;Cancelar cambios
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </div>
                )})

            </IonFooter>
        </IonPage>
    );
};

export default UserSettings;
