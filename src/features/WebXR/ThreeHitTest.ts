import { ThreeCtx } from "./ThreeInit";

// この関数はヒットテストソースの取得とレティクルの更新のみ責務を持つ
export async function updateHitTest(ctx: ThreeCtx, frame: XRFrame | undefined) {
    if (!frame) return;

    const session = ctx.renderer.xr.getSession();
    if (!session) return;

    // 1. ヒットテストソースをリクエスト (まだなら)
    if (ctx.hitTestSourceRequested === false) {
        ctx.hitTestSourceRequested = true; // すぐにフラグを立てて重複リクエストを防ぐ

        try {
            const viewerReferenceSpace = await session.requestReferenceSpace('viewer');
            const source = await session.requestHitTestSource?.({ space: viewerReferenceSpace });

            if (source) {
                ctx.hitTestSource = source;
                // セッション終了時にソースを破棄するリスナーを追加
                session.addEventListener('end', () => {
                    source.cancel();
                    ctx.hitTestSource = null;
                    ctx.hitTestSourceRequested = false;
                }, { once: true });
            }
        } catch (error) {
            console.error("Could not get hit test source:", error);
            ctx.hitTestSourceRequested = false; // エラーが起きたら再リクエストできるようにフラグを戻す
        }
    }

    // 2. ヒットテストを実行
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