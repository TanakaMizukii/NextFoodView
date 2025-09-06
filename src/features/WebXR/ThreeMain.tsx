import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from 'three';
import { initThree, attachResizeHandlers, startARSession } from "@/features/WebXR/ThreeInit";
import { loadModel } from "@/features/WebXR/ThreeLoad";
import { handleClick } from "@/features/WebXR/ThreeClick";
import LoadingPanel from "@/components/LoadingPanel";
import GuideScanPlane from "@/components/GuideScanPlane";
import { updateHitTest } from "./ThreeHitTest";

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
                setCtx(prevCtx => {
                    // ctxが存在しないなら何も行わない。
                    if (!prevCtx) return null;
                    return { ...prevCtx, currentSession: session };
                });

                // セッション終了時の処理
                session.addEventListener('end', () => {
                    console.log('AR Session ended');
                    setCtx(prevCtx => {
                        if (!prevCtx) return null;
                        return { ...prevCtx, currentSession: undefined };
                    });
                });
            } catch (error) {
                console.error("Failed to start AR session:", error);
                alert(error);
            }
        })();
    }, [startAR, ctx]);


    useEffect(() => {
        // 初期化処理
        const scanningOverlay = document.getElementById('scanning-overlay');
        const menuContainer = document.getElementById('menu-container');
        if (menuContainer) {menuContainer.style.display = 'none'}

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

        threeContext.renderer.setAnimationLoop((timestamp, frame) => {
            if (frame) {
                // ヒットテストロジックを外部ファイルから呼び出す
                updateHitTest(threeContext, frame);

                // UI更新や初回モデル表示のロジック
                if (threeContext.reticle.visible) {
                    if (scanningOverlay) {scanningOverlay.style.display = 'none'}
                    // showARUI();
                    if (menuContainer) {menuContainer.style.display = 'block'}
                    console.log('レティクル表示');

                    if (reticleShowTime === null) {
                        reticleShowTime = timestamp;
                    }

                    if (viewNum === 0 && reticleShowTime !== null && timestamp - reticleShowTime > 1500) {
                        // window.loadModel('./models/Tun_of2.glb', 'タンの中の上質な部分を選別 程よい油が口の中に広がります');
                        viewNum = 1;
                        reticleShowTime = null;
                    }
                } else {
                    reticleShowTime = null;
                };
            };

            // レンダリング
            threeContext.renderer.render(threeContext.scene, threeContext.camera);
            threeContext.labelRenderer.render(threeContext.scene, threeContext.camera);
        });

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
            <div id="wrapper" ref={containerRef} >
                <canvas id="myCanvas" ref={canvasRef} />
            </div>
        </>
    );
}
