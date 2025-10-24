import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from 'three';
import { initThree, attachResizeHandlers } from "@/features/QRScan/ThreeInit";
import { loadModel } from "@/features/QRScan/ThreeLoad";
import { handleClick } from "@/features/QRScan/ThreeClick";
import LoadingPanel from "@/components/LoadingPanel";


/** AR.js Main */
type ThreeContext = ReturnType<typeof initThree>;

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

type ThreeMainProps = {
    setChangeModel: React.Dispatch<React.SetStateAction<ChangeModelFn>>;
    onCameraReady: () => void;
    onGuideDismiss: () => void;
};

export default function ThreeMain({ setChangeModel, onCameraReady, onGuideDismiss }: ThreeMainProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nowModelRef = useRef<THREE.Group | null>(null);
    const [ctx, setCtx] = useState<ThreeContext | null>(null);

    const changeModel = useCallback(async (modelInfo: { modelName?: string, modelPath?: string; modelDetail?: string; modelPrice?: string; }) => {
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
        };
        const threeContext = initThree(canvasElement, rendererOptions, onCameraReady, onGuideDismiss);
        setCtx(threeContext);
        const clickHandler = handleClick(threeContext);
        const menuContainer = document.getElementById('menu-container');
        if (menuContainer) {menuContainer.style.display = 'block'};
        threeContext.labelRenderer.domElement.addEventListener('click', clickHandler);

        (async () => {
            const firstModel = {};
            // useEffect内で直接呼び出す代わりに、state更新後のeffectを利用
            if(threeContext){
                const nowModel = await loadModel(firstModel, threeContext, null);
                nowModelRef.current = nowModel;
            }
        })();

        const detach = attachResizeHandlers(threeContext, containerRef.current);

        function animate() {
            if (threeContext.arToolkitSource.ready) {
                threeContext.arToolkitContext.update(threeContext.arToolkitSource.domElement);
            }
            threeContext.smoothedControls.update(threeContext.markerRoot);
            threeContext.renderer.render(threeContext.scene, threeContext.camera);
            threeContext.labelRenderer.render(threeContext.scene, threeContext.camera);
            requestAnimationFrame(animate)
        }
        animate();

        return () => {
            threeContext.labelRenderer.domElement.removeEventListener('click', clickHandler);
            detach();
            threeContext.dispose();
        };
    }, [onCameraReady, onGuideDismiss]);

    return (
        <>
            <LoadingPanel />
            <div id="wrapper" ref={containerRef} >
                <canvas id="myCanvas" ref={canvasRef} />
            </div>
        </>
    );
}
