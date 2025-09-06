import { ThreeCtx } from "./ThreeInit";

// --- 以下は funcHitTest 内でのみ使用されるヘルパー関数 ---

export async function updateHitTest(ctx: ThreeCtx, frame: XRFrame | undefined) {
    if (!frame) return;

    const session = ctx.renderer.xr.getSession();
    if (!session) return;

    if (ctx.hitTestSourceRequested === false) {
        ctx.hitTestSourceRequested = true;
        try {
            const viewerReferenceSpace = await session.requestReferenceSpace('viewer');
            const source = await session.requestHitTestSource?.({ space: viewerReferenceSpace });

            if (source) {
                ctx.hitTestSource = source;
                session.addEventListener('end', () => {
                    source.cancel();
                    ctx.hitTestSource = null;
                    ctx.hitTestSourceRequested = false;
                }, { once: true });
            }
        } catch (error) {
            console.error("Could not get hit test source:", error);
            ctx.hitTestSourceRequested = false;
        }
    }

    if (ctx.hitTestSource) {
        const hitTestResults = frame.getHitTestResults(ctx.hitTestSource);
        if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            const referenceSpace = ctx.renderer.xr.getReferenceSpace();
            if (referenceSpace) {
                const pose = hit.getPose(referenceSpace);
                if (pose) {
                    ctx.reticle.visible = true;
                    ctx.reticle.matrix.fromArray(pose.transform.matrix);
                }
            }
        } else {
            ctx.reticle.visible = false;
        }
    }
}

export function firstHitChange(timestamp: DOMHighResTimeStamp, isVisible: boolean, reticleShowTime: DOMHighResTimeStamp | null, viewNum: number) {
    let newReticleShowTime = reticleShowTime;
    let newViewNum = viewNum;
    let shouldLoad = false;

    if (isVisible) {
        if (newReticleShowTime === null) {
            newReticleShowTime = timestamp;
        }
        if (newViewNum === 0 && newReticleShowTime !== null && timestamp - newReticleShowTime > 1500) {
            shouldLoad = true;
            newViewNum = 1;
            newReticleShowTime = null;
        }
    } else {
        newReticleShowTime = null;
    }

    return { newReticleShowTime, newViewNum, shouldLoad };
}

// --- 型定義 ---
export type HitTestStates = {
    reticleShowTime: DOMHighResTimeStamp | null;
    viewNum: number;
};

export type LoadModelCallback = (modelInfo: { modelPath: string; modelDetail: string; }) => Promise<void>;

// --- エクスポートするメイン関数 ---
export async function funcHitTest(
    timestamp: DOMHighResTimeStamp,
    frame: XRFrame | undefined,
    ctx: ThreeCtx,
    states: HitTestStates,
    changeModel: LoadModelCallback
): Promise<HitTestStates> {
    // 1. 平面検出とレティクル更新
    await updateHitTest(ctx, frame);

    // 2. UI更新
    if (ctx.reticle.visible) {
        const scanningOverlay = document.getElementById('scanning-overlay');
        const menuContainer = document.getElementById('menu-container');
        const arUI = document.getElementById('ar-ui');
        const exitButton = document.getElementById('exit-button');
        if (scanningOverlay && menuContainer && arUI && exitButton) {
            scanningOverlay.style.display = 'none';
            menuContainer.style.display = 'block';
            arUI.style.display = 'block';
            exitButton.style.display = 'block';
        }
    }

    // 3. 初回モデル表示のタイミングを判断
    const { newReticleShowTime, newViewNum, shouldLoad } = firstHitChange(
        timestamp,
        ctx.reticle.visible,
        states.reticleShowTime,
        states.viewNum
    );

    // 4. 必要であればモデルをロード
    if (shouldLoad) {
        await changeModel({ modelPath: '/models/tongue_comp2.glb', modelDetail: 'タンの中の上質な部分を選別 程よい油が口の中に広がります' });
    }

    // 5. 更新された状態を返す
    return {
        reticleShowTime: newReticleShowTime,
        viewNum: newViewNum,
    };
}
