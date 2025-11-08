import { ThreeCtx } from "./ThreeInit";
import { loadModel } from "./ThreeLoad";
import type { RefObject } from 'react';

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

export async function handleFirstHit(
    ctx: ThreeCtx,
    timestamp: DOMHighResTimeStamp,
    reticleShowTimeRef: RefObject<DOMHighResTimeStamp | null>,
    viewNumRef: RefObject<number>
): Promise<boolean> {
    if (viewNumRef.current !== 0) {
        return false;
    }

    const isVisible = ctx.reticle.visible;
    let shouldShowUI = false;

    if (isVisible) {
        const scanningOverlay = document.getElementById('scanning-overlay');
        const menuContainer = document.getElementById('menu-container');
        if (scanningOverlay && menuContainer) {
            scanningOverlay.style.display = 'none';
            menuContainer.style.display = 'block';
        }

        shouldShowUI = true;

        if (reticleShowTimeRef.current === null) {
            reticleShowTimeRef.current = timestamp;
        }

        if (reticleShowTimeRef.current !== null && timestamp - reticleShowTimeRef.current > 1500) {
            viewNumRef.current = 1;
            reticleShowTimeRef.current = null;
            await loadModel({}, ctx, null);
        }
    } else {
        reticleShowTimeRef.current = null;
    }

    return shouldShowUI;
}