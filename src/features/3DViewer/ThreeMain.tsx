import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from 'three';
import { initThree, attachResizeHandlers } from "./ThreeInit";
import { loadModel } from "./ThreeLoad";
import { handleClick } from "./ThreeClick";
import LoadingPanel from "@/components/LoadingPanel";

type ThreeContext = ReturnType<typeof initThree>;

// 先に型を用意
type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

// これにする：
type ThreeMainProps = {
    setChangeModel: React.Dispatch<React.SetStateAction<ChangeModelFn>>;
};

export default function ThreeMain({ setChangeModel }: ThreeMainProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nowModelRef = useRef<THREE.Group | null>(null);
    const [ctx, setCtx] = useState<ThreeContext | null>(null);

    const changeModel = useCallback(async (modelInfo: { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; }) => {
        if (!ctx) return;
        // 新しいモデルをロード
        const nowModel = await loadModel(modelInfo, ctx, nowModelRef.current);
        nowModelRef.current = nowModel;
    }, [ctx]);

    useEffect(() => {
        setChangeModel(() => changeModel);
        // アンマウント時に念のため no-op を戻すなら（任意）
        return () => setChangeModel(() => async () => {});
    }, [changeModel, setChangeModel]);


    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const canvasElement = canvasRef.current;
        const rendererOptions = {
            pixelRatioCap: 2,
            alpha: true,
            antialias: true,
            useControls: true,
        };
        const threeContext = initThree(canvasElement, rendererOptions);
        setCtx(threeContext);
        const menuContainer = document.getElementById('menu-container');
        if (menuContainer) {menuContainer.style.display = 'block'}
        const openPanel = document.getElementById('menu-openGuide')
        if (openPanel) {openPanel.style.display = 'flex'};
        const clickHandler = handleClick(threeContext);
        threeContext.labelRenderer.domElement.addEventListener('click', clickHandler);

        (async () => {
            const firstModel = {};
            // useEffect内で直接呼び出す代わりに、state更新後のeffectを利用
            if(threeContext){
                const nowModel = await loadModel(firstModel, threeContext, nowModelRef.current);
                nowModelRef.current = nowModel;
            }
        })();

        const detach = attachResizeHandlers(threeContext, containerRef.current);

        function animation() {
            console.log(threeContext.camera.position);
            threeContext.controls?.update();
            threeContext.renderer.render(threeContext.scene, threeContext.camera);
            threeContext.labelRenderer.render(threeContext.scene, threeContext.camera);
        }
        threeContext.renderer.setAnimationLoop(animation);

        return () => {
            threeContext.labelRenderer.domElement.removeEventListener('click', clickHandler);
            detach();
            threeContext.dispose();
        };
    }, []);

    return (
        <>
            <LoadingPanel />
            <div id="wrapper" ref={containerRef} >
                <canvas id="myCanvas" ref={canvasRef} />
            </div>
        </>
    );
}
