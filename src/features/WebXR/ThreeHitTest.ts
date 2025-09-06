import { ThreeCtx } from "./ThreeInit";

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
        if (newViewNum === 0 && newReticleShowTime !== null && timestamp - newReticleShowTime > 2000) {
            shouldLoad = true;
            newViewNum = 1;
            newReticleShowTime = null;
        }
    } else {
        newReticleShowTime = null;
    }

    return { newReticleShowTime, newViewNum, shouldLoad };
}