import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonTextarea, IonList, IonItem, IonButton, IonLabel, IonIcon } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';

const RegistrarProducto: React.FC = () => {
  const [product, setProduct] = useState({
    name: '',
    price: ''
    // Otros campos del producto acá
  });

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const registerProduct = () => {
    // Aquí implementa la lógica para registrar el producto
    console.log("Producto registrado:", product);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          
            <IonButton slot='start' routerLink='/' routerDirection='back'>
              <IonIcon icon={ chevronBackOutline } />&nbsp;Regresar
            </IonButton>
            <IonTitle>Registrar Producto</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel position="floating">Nombre del Producto</IonLabel>
            <IonInput type="text" name="name" value={product.name} onIonChange={handleInputChange} required></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Descripción</IonLabel>
            <IonTextarea name="description"  onIonChange={handleInputChange} required></IonTextarea>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Precio</IonLabel>
            <IonTextarea name="description" value={product.price} onIonChange={handleInputChange} required></IonTextarea>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">EAN</IonLabel>
            <IonTextarea name="description" onIonChange={handleInputChange} required></IonTextarea>
          </IonItem>
          {/* Otros campos del producto */}
        </IonList>
        <IonButton expand="block" onClick={registerProduct}>Registrar Producto</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default RegistrarProducto;
