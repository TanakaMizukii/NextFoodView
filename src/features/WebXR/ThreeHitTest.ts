import * as THREE from 'three';
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

    // Raycaster for reticle transparency
    const cameraDirection = new THREE.Vector3();
    ctx.camera.getWorldDirection(cameraDirection);
    ctx.raycaster.set(ctx.camera.position, cameraDirection);

    const intersects = ctx.raycaster.intersectObjects(ctx.objectList, true);

    if (intersects.length > 0) {
        // Make reticle semi-transparent if it's behind an object
        (ctx.reticle.material as THREE.Material).opacity = 0.1;
    } else {
        // Otherwise, make it fully opaque
        (ctx.reticle.material as THREE.Material).opacity = 1.0;
    }
}

export async function handleFirstHit(
    ctx: ThreeCtx,
    timestamp: DOMHighResTimeStamp,
    reticleShowTimeRef: RefObject<DOMHighResTimeStamp | null>,
    viewNumRef: RefObject<number>
) {
    if (viewNumRef.current !== 0) {
        return;
    }

    const isVisible = ctx.reticle.visible;

    if (isVisible) {
        const scanningOverlay = document.getElementById('scanning-overlay');
        const menuContainer = document.getElementById('menu-container');
        const openPanel = document.getElementById('menu-openGuide')
        const arUI = document.getElementById('ar-ui');
        const exitButton = document.getElementById('exit-button');
        const clearObjects = document.getElementById('clear-objects');
        if (scanningOverlay && menuContainer && openPanel && arUI && exitButton && clearObjects) {
            scanningOverlay.style.display = 'none';
            menuContainer.style.display = 'block';
            openPanel.style.display = 'flex';
            arUI.style.display = 'block';
            exitButton.style.display = 'block';
            clearObjects.style.display = 'flex';
        }

        if (reticleShowTimeRef.current === null) {
            reticleShowTimeRef.current = timestamp;
        }

        if (reticleShowTimeRef.current !== null && timestamp - reticleShowTimeRef.current > 1500) {
            viewNumRef.current = 1;
            reticleShowTimeRef.current = null;
            await loadModel({}, ctx);
        }
    } else {
        reticleShowTimeRef.current = null;
    }
}