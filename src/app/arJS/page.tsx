'use client'

import { useState, useCallback } from 'react';
import '../App.css';
import MenuContainer from '@/components/MenuContainer';
import { ModelChangeContext } from '@/contexts/ModelChangeContext';
import dynamic from 'next/dynamic';
import LoadingPanel from '@/components/LoadingPanel';
import GuideQRCode from '@/components/GuideQRCode';

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

// ThreeMainコンポーネントをdynamic importに書き換えてハイドレーションエラーが起きないようにする。
const ThreeMain = dynamic(() => import('@/features/ARjs/ThreeMain'), {
    ssr: false, // サーバーサイドレンダリングを無効化
});

export default function ARjsPage() {
    const [changeModel, setChangeModel] = useState<ChangeModelFn>(() => async (info: ModelInfo) => {
        console.warn("changeModel is not yet initialized", info);
    });
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isGuideVisible, setIsGuideVisible] = useState(false);
    const [guideText, setGuideText] = useState("カメラを準備しています...\n少々お待ちください。\n\n案内が出たら「許可」を押してください");

    const handleCameraReady = useCallback(() => {
        setIsCameraReady(true);
        setIsGuideVisible(true);
    }, []);

    const handleGuideDismiss = useCallback(() => {
        setIsGuideVisible(false);
        setGuideText("モデルを読み込み中です...\n少々お待ちください");
        const openPanel = document.getElementById('menu-openGuide')
        const arUI = document.getElementById('ar-ui');
        const exitButton = document.getElementById('exit-button');
        if (openPanel && arUI && exitButton) {
            openPanel.style.display = 'flex';
            arUI.style.display = 'block';
            exitButton.style.display = 'block';
        };
    }, []);

    return (
        <>
            <LoadingPanel isVisible={!isCameraReady} text={guideText} />
            <GuideQRCode isVisible={isGuideVisible} />
            <ModelChangeContext.Provider value={{ changeModel }}>
                <ThreeMain
                    setChangeModel={setChangeModel}
                    onCameraReady={handleCameraReady}
                    onGuideDismiss={handleGuideDismiss}
                />
                <MenuContainer />
            </ModelChangeContext.Provider>
        </>
    );
}