import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonList, IonPage, IonToolbar, IonTitle, IonButtons, IonIcon } from "@ionic/react";
import { chevronBackOutline } from "ionicons/icons";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import './AddUser.css';

const AddUser: React.FC = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const handleAddUser = async () => {
        const newUser = {
            name: userName,
            password: password,
            activated: false,
            registrationDate: new Date().toISOString()
        };

        // Obtener los usuarios actuales del archivo JSON
        try {
            const response = await fetch("/users.json");
            const data = await response.json();
            const users = data.users || [];

            // Añadir el nuevo usuario
            users.push(newUser);

            // Guardar los usuarios actualizados en el archivo JSON
            await fetch("/users.json", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ users })
            });

            // Redirigir a la página de ajustes de usuario y actualizar la página
            history.replace("/ajustes-usuario");
            window.location.reload();

        } catch (error) {
            console.error("Error al guardar el usuario:", error);
        }
    };

    return (
        <IonPage className="simplePage">
            <IonHeader>
                <IonToolbar>
                    <IonButtons>
                        <IonButton slot="start" onClick={() => history.goBack()}> <IonIcon color="dark" icon={ chevronBackOutline } />&nbsp;Regresar</IonButton>
                    </IonButtons>
                    <IonTitle>Añadir Nuevo Usuario</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonItem>
                        <IonInput
                            label="Nombre del Usuario"
                            value={userName}
                            onIonChange={e => setUserName(e.detail.value!)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonInput
                            type="password"
                            label="Contraseña"
                            value={password}
                            onIonChange={e => setPassword(e.detail.value!)}
                        />
                    </IonItem>
                </IonList>
                <IonButton color="primary" expand="block" onClick={handleAddUser}>
                    Añadir Usuario
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default AddUser;
