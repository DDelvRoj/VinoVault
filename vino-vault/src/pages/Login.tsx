import React, { useEffect, useState } from 'react';
import { useAutenticacion } from '../contexts/AutenticacionContext';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonAlert } from '@ionic/react';
import './Login.css';
import { TokenStore } from '../data/TokenStore';
import { useHistory } from 'react-router';

const Login: React.FC = () => {
    const token = TokenStore.useState(s=>s.token);
    const [usuario, setUsuario] = useState<string|null>(null);
    const [clave, setClave] = useState<string|null>(null);
    const [camposCompletos, setCamposCompletos] = useState(false);
    const { login } = useAutenticacion();
    const [error, setError] = useState<string | null>(null);
    const history = useHistory();
    useEffect(()=>{
        if(token){
            history.push('/');
        }
    },[token])

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        try {
            if( usuario && clave){
                await login(usuario, clave);
                return;
            }
            setError('Hay valores vacíos')
        } catch (error) {
            console.log(error);
            
            setError('Login fallido');
        }
    };

    const handleUsuario = (event: CustomEvent) => {
        const value = event.detail.value!;
        setUsuario(value);
        evaluarCampos();
    };
    const handleClave = (event: CustomEvent) => {
        const value = event.detail.value!;
        setClave(value);
        evaluarCampos();
    };

    const evaluarCampos = ()=>{
        const val = !(!usuario || !clave);
        setCamposCompletos(val);
    }

  return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonTitle>Iniciar Sesión</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
        <form onSubmit={handleLogin}>
            <div className="login-wrapper">
                
                <div className="brand">
                Login
                </div>

                <IonItem color="light">
                <IonInput  value={usuario} placeholder="Usuario" required onIonInput={handleUsuario}></IonInput>
                </IonItem>

                <IonItem color="light">
                <IonInput value={clave} placeholder="Clave" required type="password" onIonInput={handleClave}></IonInput>
                </IonItem>
                <IonButton expand="full" color="dark" type="submit" disabled={!camposCompletos} >
                Iniciar Sesión
                </IonButton>

            </div>
        </form>
        {error && <IonAlert isOpen={true} header={'Error'} message={error} buttons={['OK']} />}
        </IonContent>
    </IonPage>
  );
};

export default Login;