import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from 'three';
import { initThree, attachResizeHandlers, startARSession } from "@/features/WebXR/ThreeInit";
import { loadModel } from "@/features/WebXR/ThreeLoad";
import { handleClick } from "@/features/WebXR/ThreeClick";
import LoadingPanel from "@/components/LoadingPanel";
import GuideScanPlane from "@/components/GuideScanPlane";
import ARHelper from "@/components/ARHelper";
import { updateHitTest, firstHitChange} from "./ThreeHitTest";

type ThreeContext = ReturnType<typeof initThree>;

// 先に型を用意
type ModelInfo = { modelPath?: string; modelDetail?: string };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

type ThreeMainProps = {
    setChangeModel: React.Dispatch<React.SetStateAction<ChangeModelFn>>;
    startAR: boolean;
};

export default function ThreeMain({ setChangeModel, startAR }: ThreeMainProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nowModelRef = useRef<THREE.Group | null>(null);
    const [ctx, setCtx] = useState<ThreeContext | null>(null);

    const changeModel = useCallback(async (modelInfo: { modelPath?: string; modelDetail?: string; }) => {
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
                    setCtx(prevCtx => prevCtx? { ...prevCtx, currentSession: undefined } : prevCtx);
                });
            } catch (error) {
                console.error("Failed to start AR session:", error);
                alert(error);
            }
        })();
    }, [startAR, ctx]);

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

        // 初回オブジェクト表示に使用する変数を作成
        let reticleShowTime: DOMHighResTimeStamp | null = null;
        let viewNum = 0;

        threeContext.renderer.setAnimationLoop(animate);
        async function animate(timestamp: DOMHighResTimeStamp, frame: XRFrame) {
            // ヒットテストロジック呼び出し関数
            updateHitTest(threeContext, frame);

            // 初回モデル表示関数の実行
            if (!viewNum) {
                const status = firstHitChange(timestamp, threeContext.reticle.visible, reticleShowTime, viewNum);
                // 状態を更新
                reticleShowTime = status.newReticleShowTime;
                viewNum = status.newViewNum;
                // UI更新
                if (threeContext.reticle.visible) {
                    const scanningOverlay = document.getElementById('scanning-overlay');
                    const menuContainer = document.getElementById('menu-container');
                    const arUI = document.getElementById('ar-ui');
                    const exitButton = document.getElementById('exit-button');
                    if (scanningOverlay && menuContainer && arUI && exitButton) {
                        menuContainer.style.display = 'block';
                        arUI.style.display = 'block';
                        exitButton.style.display = 'block';
                        scanningOverlay.style.display = 'none';
                    }
                };

                // モデルをロードすべきか判断
                if (status.shouldLoad) {
                    await loadModel({}, threeContext, null);
                }
            }

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
            <ARHelper />
            <div id="wrapper" ref={containerRef} >
                <canvas id="myCanvas" ref={canvasRef} />
            </div>
        </>
    );
}
