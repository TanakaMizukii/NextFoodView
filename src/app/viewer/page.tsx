'use client'

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import '../App.css';
import { ModelChangeContext } from '@/contexts/ModelChangeContext';
import dynamic from 'next/dynamic';
import TopAppBar from '@/components/Viewer/TopAppBar';
import CategoryCarousel from '@/components/Viewer/CategoryCarousel';
import NavArrows from '@/components/Viewer/NavArrows';
import SpecificPanels from '@/components/Viewer/SpecificPanels';
import BottomSheet from '@/components/Viewer/BottomSheet';
import PrimaryFab from '@/components/Viewer/PrimaryFab';
import LoadingPanel from '@/components/LoadingPanel';

import productModels from '@/data/MenuInfo';
import type { ProductModel } from '@/data/MenuInfo';
import SideSlidePanel from '@/components/Viewer/SideSlidePanel';
import TutorialOverlay from '@/components/TutorialOverlay';

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

// ThreeMainコンポーネントをdynamic importに書き換えてハイドレーションエラーが起きないようにする。
const ThreeMain = dynamic(() => import('@/features/3DViewer/ThreeMain'), {
    ssr: false, // サーバーサイドレンダリングを無効化
});

export default function ViewerPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentCategory, setCurrentCategory] = useState(1); // カルビが初期選択
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showTutorial, setShowTutorial] = useState(true);

    const currentProduct: ProductModel = productModels[currentIndex]

    const [changeModel, setChangeModel] = useState<ChangeModelFn>(() => async (info: ModelInfo) => {
        console.warn("changeModel is not yet initialized", info);
    });

    // changeModelをラップして、メニューを閉じる機能を追加
    const wrappedChangeModel: ChangeModelFn = async (info) => {
        setMenuOpen(false);
        await changeModel(info);
    };

    useEffect(() => {
        const timer = setTimeout(() => setShowTutorial(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
        <TutorialOverlay isVisible={showTutorial} onClose={() => setShowTutorial(false)}/>
        <LoadingPanel isVisible={loading} />
        <ModelChangeContext.Provider value={{ changeModel: wrappedChangeModel }}>
            <Root>
                <SceneLayer>
                    <ThreeMain setChangeModel={setChangeModel} onLoadingChange={setLoading} />
                </SceneLayer>

                <TopLayer>
                    <TopAppBar menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
                    <CategoryCarousel currentCategory={currentCategory} setCurrentCategory={setCurrentCategory}/>
                    <PrimaryFab />
                </TopLayer>

                <BottomLayer>
                    <SideSlidePanel menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
                    <NavArrows currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>
                    <SpecificPanels currentIndex={currentIndex} currentCategory={currentCategory} setCurrentIndex={setCurrentIndex}/>
                    <BottomSheet currentProduct={currentProduct}/>
                </BottomLayer>
            </Root>
        </ModelChangeContext.Provider>
        </>
    );
}

const Root = styled.div`
    position: relative;
    width: 100%;
    height: 100dvh;      /* 動的ビューポート高 */
    overflow: hidden;
`;

const SceneLayer = styled.div`
    position: absolute;
    inset: 0;            /* = top:0; right:0; bottom:0; left:0 */
    z-index: 0;
`;

const TopLayer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    /* 下の3Dを操作可能に保ちたい時は必要に応じて */
    pointer-events: auto;
    & > * { pointer-events: auto; } /* ボタン等は操作可能 */
`;

const BottomLayer = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    /* 下の3Dを操作可能に保ちたい時は必要に応じて */
    pointer-events: auto;
    & > * { pointer-events: auto; } /* ボタン等は操作可能 */
`;