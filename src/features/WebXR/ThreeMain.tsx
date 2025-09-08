import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from 'three';
import { initThree, attachResizeHandlers, startARSession } from "@/features/WebXR/ThreeInit";
import { loadModel } from "@/features/WebXR/ThreeLoad";
import { handleClick } from "@/features/WebXR/ThreeClick";
import LoadingPanel from "@/components/LoadingPanel";
import GuideScanPlane from "@/components/GuideScanPlane";
import ARHelper from "@/components/ARHelper";
import { updateHitTest, handleFirstHit } from "./ThreeHitTest";
import { handleSessionEndCleanup } from './ThreeCleanup';

type ThreeContext = ReturnType<typeof initThree>;

// 先に型を用意
type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

type ThreeMainProps = {
    setChangeModel: React.Dispatch<React.SetStateAction<ChangeModelFn>>;
    startAR: boolean;
    onSessionEnd: () => void;
};

export default function ThreeMain({ setChangeModel, startAR, onSessionEnd }: ThreeMainProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nowModelRef = useRef<THREE.Group | null>(null);
    const [ctx, setCtx] = useState<ThreeContext | null>(null);
    const reticleShowTimeRef = useRef<DOMHighResTimeStamp | null>(null);
    const viewNumRef = useRef<number>(0);

    const changeModel = useCallback(async (modelInfo: { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; }) => {
        if (!ctx) return;
        // 新しいモデルをロード
        const nowModel = await loadModel(modelInfo, ctx, nowModelRef.current);
        nowModelRef.current = nowModel;
    }, [ctx]);

    useEffect(() => {
        setChangeModel(() => changeModel);
        return () => setChangeModel(() => async () => {});
    }, [changeModel, setChangeModel]);

    useEffect(() => {
        if (!startAR || !ctx || ctx.currentSession) return;

        (async () => {
            try {
                const session = await startARSession(ctx.renderer);
                if (! session) return;

                // セッション情報をコンテキストに保存
                setCtx(prevCtx => prevCtx? { ...prevCtx, currentSession: session } : prevCtx);

                // セッション終了時の処理
                session.addEventListener('end', () => {
                    handleSessionEndCleanup(ctx, nowModelRef, reticleShowTimeRef, viewNumRef);
                    setCtx(prevCtx => prevCtx? { ...prevCtx, currentSession: undefined } : prevCtx);
                    onSessionEnd();
                });
            } catch (error) {
                console.error("Failed to start AR session:", error);
                alert(error);
            }
        })();
    }, [startAR, ctx, onSessionEnd]);

    useEffect(() => {
        // 初期化処理
        if (!containerRef.current || !canvasRef.current) return;

        const canvasElement = canvasRef.current;
        const rendererOptions = {
            pixelRatioCap: 2,
            alpha: true,
            antialias: true,
        };
        const threeContext = initThree(canvasElement, rendererOptions);
        setCtx(threeContext);
        const clickHandler = handleClick(threeContext);
        threeContext.labelRenderer.domElement.addEventListener('click', clickHandler);

        const detach = attachResizeHandlers(threeContext, containerRef.current);

        threeContext.renderer.setAnimationLoop(animate);
        async function animate(timestamp: DOMHighResTimeStamp, frame: XRFrame) {
            // ヒットテスト実行関数
            updateHitTest(threeContext, frame);
            // 初回ヒット時の処理関数
            await handleFirstHit(threeContext, timestamp, reticleShowTimeRef, viewNumRef);

            // レンダリング
            threeContext.renderer.render(threeContext.scene, threeContext.camera);
            threeContext.labelRenderer.render(threeContext.scene, threeContext.camera);
        };

        return () => {
            threeContext.renderer.setAnimationLoop(null);
            threeContext.labelRenderer.domElement.removeEventListener('click', clickHandler);
            detach();
            threeContext.dispose();
        };
    }, []);

    return (
        <>
            <GuideScanPlane />
            <LoadingPanel />
            <ARHelper ctx={ctx} />
            <div id="wrapper" ref={containerRef} >
                <canvas id="myCanvas" ref={canvasRef} />
            </div>
        </>
    );
}
