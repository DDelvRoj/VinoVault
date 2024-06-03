import { IonButton, IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonToggle } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const UserSettings: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const history = useHistory();

    useEffect(() => {
        // Cargar los usuarios desde el archivo JSON al cargar la página
        const fetchData = async () => {
            try {
                const response = await fetch("/users.json");
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            }
        };

        fetchData();
    }, []);

    const handleDeleteUser = (index: number) => {
        const updatedUsers = users.filter((_, i) => i !== index);
        setUsers(updatedUsers);
        saveUsers(updatedUsers);
    };

    const saveUsers = async (users: any[]) => {
        try {
            await fetch("/users.json", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ users })
            });
        } catch (error) {
            console.error("Error al guardar los usuarios:", error);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Ajustes de Usuario</IonTitle>
                    <IonButton slot="end" onClick={() => history.goBack()}>Regresar</IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol><strong>Nombre</strong></IonCol>
                        <IonCol><strong>Fecha de Registro</strong></IonCol>
                        <IonCol><strong>Activado</strong></IonCol>
                        <IonCol><strong>Acciones</strong></IonCol>
                    </IonRow>
                    {users.map((user, index) => (
                        <IonRow key={index}>
                            <IonCol>{user.name}</IonCol>
                            <IonCol>{new Date(user.registrationDate).toLocaleDateString()}</IonCol>
                            <IonCol>
                                <IonToggle checked={user.activated} onIonChange={e => {
                                    const updatedUsers = [...users];
                                    updatedUsers[index].activated = e.detail.checked;
                                    setUsers(updatedUsers);
                                    saveUsers(updatedUsers);
                                }} />
                            </IonCol>
                            <IonCol>
                                <IonButton color="danger" onClick={() => handleDeleteUser(index)}>Borrar</IonButton>
                            </IonCol>
                        </IonRow>
                    ))}
                </IonGrid>
                <IonButton color="primary" expand="block" routerLink="/add-user">
                    Añadir Nuevo Usuario
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default UserSettings;
