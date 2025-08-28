import { useState } from 'react';
import './App.css';
import MenuContainer from './Components/MenuContainer';
import ThreeMain from './ThreeMain';
import { ModelChangeContext } from './contexts/ModelChangeContext';

function App() {
  type ModelInfo = { modelPath?: string; modelDetail?: string };
  type ChangeModelFn = (info: ModelInfo) => Promise<void>;
  const [changeModel, setChangeModel] = useState<ChangeModelFn>(() => async (info: ModelInfo) => {
    console.warn("changeModel is not yet initialized", info);
  });

  return (
    <>
      <ModelChangeContext.Provider value={{ changeModel }}>
        <ThreeMain setChangeModel={setChangeModel} />
        <MenuContainer />
      </ModelChangeContext.Provider>
    </>
  );
}

export default App;