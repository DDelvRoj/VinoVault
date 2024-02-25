import { IonButton } from '@ionic/react';
import './ExploreContainer.css';
import { useContext } from 'react';
import { LoadingContext } from '../contexts/LoadingContext';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const {setIsLoading} = useContext(LoadingContext);


  const loadData = async () => {
    setIsLoading(true);
    setTimeout(()=>{
      setIsLoading(false);
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
