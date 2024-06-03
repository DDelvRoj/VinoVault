import { IonButton } from '@ionic/react';
import './ExploreContainer.css';
import { useContext } from 'react';
import { LoadingContext } from '../contexts/LoadingContext';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const {setEstaCargando, setPorciento} = useContext(LoadingContext);

  const loadData = async () => {
    let porcentaje = 0
    setEstaCargando(true);
    let interval = setInterval(()=>{
      porcentaje+=1;
      setPorciento(porcentaje);
    },30);
    setTimeout(()=>{
      clearInterval(interval);
      setEstaCargando(false);
    },3000);

    
  };

  return (
    <div className="container">
      <strong>{name}</strong>
      <p>JIJIJA <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      <IonButton onClick={()=>loadData()} title='Kuak' />
    </div>
  );
};

export default ExploreContainer;
