'use client'

import { useState } from 'react';
import '../App.css';
import ViewerContainer from '@/components/ViewerContainer';
import { ModelChangeContext } from '@/contexts/ModelChangeContext';
import dynamic from 'next/dynamic';

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

// ThreeMainコンポーネントをdynamic importに書き換えてハイドレーションエラーが起きないようにする。
const ThreeMain = dynamic(() => import('@/features/3DViewer/ThreeMain'), {
    ssr: false, // サーバーサイドレンダリングを無効化
});

export default function ViewerPage() {
    const [changeModel, setChangeModel] = useState<ChangeModelFn>(() => async (info: ModelInfo) => {
        console.warn("changeModel is not yet initialized", info);
    });

    return (
        <>
        <ModelChangeContext.Provider value={{ changeModel }}>
            <ThreeMain setChangeModel={setChangeModel} />
            <ViewerContainer />
        </ModelChangeContext.Provider>
        </>
    );
}