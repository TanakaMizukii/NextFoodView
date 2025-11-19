import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from 'three';
import { initThree, attachResizeHandlers, startARSession } from "@/features/WebXR/ThreeInit";
import { loadModel, disposeModel } from "@/features/WebXR/ThreeLoad";
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
    const inFlightRef = useRef(false);

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
        if (inFlightRef.current) return;
        inFlightRef.current = true;

        (async () => {
            try {
                // 既にRenderer側にセッションがあれば再利用 or 何もしない
                const existing = ctx.renderer?.xr?.getSession?.();
                if (existing) {
                    // 必要ならctx.currentSession に同期だけ取る
                    setCtx(prev => prev ? { ...prev, currentSession: existing } : prev);
                    return;
                }

                const session = await startARSession();
                if (!session) return;

                ctx.renderer.xr.setReferenceSpaceType('local');
                await ctx.renderer.xr.setSession(session);

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
            } finally {
                inFlightRef.current = false;
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

    const handleExit = () => {
        if (ctx && ctx.currentSession) {
            ctx.currentSession.end();
        }
    };

    const handleClear = () => {
        if (!ctx) return;
        // 表示されているモデルだけ削除・メモリ解放
        if (ctx.objectList) {
            ctx.objectList.forEach((obj) => {
                ctx.scene.remove(obj);
                disposeModel(obj);
            });
            // objectListを空にする
            ctx.objectList.length = 0;
            const details = document.querySelectorAll('.detail');
            details.forEach((detail) => {
            if (detail) {
                const parent = detail.parentNode;
                parent?.removeChild(detail);
            };
            // TransformControlsも削除
            ctx.transControls.detach();
        })
        };
    };

    return (
        <>
            <GuideScanPlane />
            <LoadingPanel />
            <ARHelper onExit={handleExit} onClear={handleClear} showClearObjects={true} />
            <div id="wrapper" ref={containerRef} >
                <canvas id="myCanvas" ref={canvasRef} />
            </div>
        </>
    );
}
