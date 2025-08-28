// app/ios/page.tsx
'use client'

import { useState } from 'react';
// import './App.css';
import ThreeMain from '@/lib/ThreeMain';
import MenuContainer from '@/components/MenuContainer';
import { ModelChangeContext } from '@/contexts/ModelChangeContext';

export default function ARjsPage() {
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