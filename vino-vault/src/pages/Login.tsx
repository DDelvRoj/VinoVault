import React, { useContext, useEffect, useState } from 'react';
import { useAutenticacion } from '../contexts/AutenticacionContext';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonAlert } from '@ionic/react';
import './Login.css';
import { TokenStore } from '../data/TokenStore';
import { useHistory } from 'react-router';
import { LoadingContext } from '../contexts/LoadingContext';

const Login: React.FC = () => {
    const token = TokenStore.useState(s=>s.token);
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState<string|null>(null);
    const [camposCompletos, setCamposCompletos] = useState(false);
    const { login } = useAutenticacion();
    const [error, setError] = useState<string | null>(null);
    const { setEstaCargando, setDescripcion } = useContext(LoadingContext);
    const history = useHistory();
    useEffect(()=>{
        if(token){
            history.push('/');
        }
    },[token]);

    useEffect(()=>{
        const evaluarCampos = ()=>{
            const val = !(!usuario || !clave);
            setCamposCompletos(val);
        }
        evaluarCampos();
    },[usuario, clave])

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setEstaCargando(true);
        setDescripcion('Iniciando Sesión....')
        try {
            if( usuario && clave){
                await login(usuario, clave);
                return;
            }
            setError('Hay valores vacíos')
        } catch (error) {
            console.log(error); 
            setError('Login fallido');
        } finally {
            setEstaCargando(false);
        }
    };

    

    

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
                    <IonInput  value={usuario} placeholder="Usuario" required={true} onIonInput={(e)=>setUsuario(e.detail.value??'')}></IonInput>
                </IonItem>

                <IonItem color="light">
                <IonInput value={clave} placeholder="Clave" required={true} type="password" onIonInput={(e)=>setClave(e.detail.value??'')}></IonInput>
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