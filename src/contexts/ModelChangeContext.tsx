import { createContext } from 'react';

type ModelInfo = {
    modelPath?: string | undefined;
    modelDetail?: string | undefined;
};

type ModelChangeContextType = {
    changeModel: (modelInfo: ModelInfo) => Promise<void>;
};

// デフォルトのchangeModel関数（何もしない）
const defaultChangeModel = async () => {
    console.warn("changeModel function was called without a Provider.");
};

export const ModelChangeContext = createContext<ModelChangeContextType>({
    changeModel: defaultChangeModel,
});
