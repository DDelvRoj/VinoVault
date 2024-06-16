import React, { useEffect, useState } from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonModal, IonIcon } from "@ionic/react";
import './SalesList.css'; // Importa el archivo CSS para los estilos
import { chevronBackOutline } from "ionicons/icons";

const SalesList: React.FC = () => {
    const [sales, setSales] = useState<any[]>([]);
    const [selectedSale, setSelectedSale] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Aquí puedes cargar los datos desde un archivo JSON, una API, etc.
        const fetchData = async () => {
            try {
                const response = await fetch("/sales.json"); // Ruta de tu archivo JSON
                const data = await response.json();
                setSales(data.sales);
            } catch (error) {
                console.error("Error al cargar las ventas:", error);
            }
        };

        fetchData();
    }, []);

    const handleViewClick = (sale: any) => {
        setSelectedSale(sale);
        setIsModalOpen(true);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonButton slot='start' onClick={() => history.back()}>
              <IonIcon icon={ chevronBackOutline } />&nbsp;Regresar
            </IonButton>
                    <IonTitle>Lista de Ventas</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonItem>
                        <div className="sales-header">
                            <span className="sales-column">Nombre del Vendedor</span>
                            <span className="sales-column">Fecha de Venta</span>
                            <span className="sales-column">Total</span>
                            <span className="sales-column">Acciones</span>
                        </div>
                    </IonItem>
                    {sales.map(sale => (
                        <IonItem key={sale.id}>
                            <div className="sales-row">
                                <span className="sales-column">{sale.seller}</span>
                                <span className="sales-column">{sale.date}</span>
                                <span className="sales-column">${sale.total.toFixed(2)}</span>
                                <span className="sales-column">
                                    <IonButton color="primary" onClick={() => handleViewClick(sale)}>
                                        Ver
                                    </IonButton>
                                </span>
                            </div>
                        </IonItem>
                    ))}
                </IonList>
                <IonButton color="primary" expand="block" >
                    Registrar Nueva Venta
                </IonButton>

                <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Detalles de la Venta</IonTitle>
                            <IonButton slot="end" onClick={() => setIsModalOpen(false)}>Cerrar</IonButton>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        {selectedSale && (
                            <IonList>
                                {selectedSale.products.map((product: any, index: number) => (
                                    <IonItem key={index}>
                                        <IonLabel>
                                            <h2>{product.name}</h2>
                                            <p>Cantidad: {product.quantity}</p>
                                            <p>Precio: ${product.price.toFixed(2)}</p>
                                        </IonLabel>
                                    </IonItem>
                                ))}
                            </IonList>
                        )}
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default SalesList;
