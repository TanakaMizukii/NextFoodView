import type { ThreeCtx } from './ThreeInit';
import type { RefObject } from 'react';

export function handleSessionEndCleanup(
    ctx: ThreeCtx | null,
    reticleShowTimeRef: RefObject<DOMHighResTimeStamp | null>,
    viewNumRef: RefObject<number>
) {
    if (ctx) {
        // Reticleをシーンから削除
        ctx.scene.remove(ctx.reticle);
        // objectListもクリア
        ctx.objectList.length = 0;
        // TransformControlsも削除
        ctx.transControls.detach();
    }

    // UIを復元
    const label = document.getElementById('label');
    const arUI = document.getElementById('ar-ui');
    const exitButton = document.getElementById('exit-button');
    const clearObjects = document.getElementById('clear-objects');
    const menuContainer = document.getElementById('menu-container');
    const openPanel = document.getElementById('menu-openGuide')
    const startOverlay = document.getElementById('start-overlay');

    if (label) {
        const parent = label.parentNode;
        parent?.removeChild(label);
    }

    if (arUI) arUI.style.display = 'none';
    if (exitButton) exitButton.style.display = 'none';
    if (clearObjects) clearObjects.style.display = 'none';
    if (menuContainer) menuContainer.style.display = 'none';
    if (openPanel) {openPanel.style.display = 'flex'};
    if (startOverlay) {startOverlay.style.display = 'flex'}

    // 初回表示ロジックの変数をリセット
    reticleShowTimeRef.current = null;
    viewNumRef.current = 0;

    console.log("Session cleanup complete.");
}

export function handleSessionResetCleanup(
    ctx: ThreeCtx | null,
    reticleShowTimeRef: RefObject<DOMHighResTimeStamp | null>,
    viewNumRef: RefObject<number>
) {
    if (ctx) {
        // Reticleをシーンから削除
        ctx.scene.remove(ctx.reticle);
        // objectListもクリア
        ctx.objectList.length = 0;
        // TransformControlsも削除
        ctx.transControls.detach();
    }

    // UIを復元
    const label = document.getElementById('label');
    const arUI = document.getElementById('ar-ui');
    const exitButton = document.getElementById('exit-button');
    const clearObjects = document.getElementById('clear-objects');
    const menuContainer = document.getElementById('menu-container');
    const openPanel = document.getElementById('menu-openGuide')
    const resetOverlay = document.getElementById('reset-overlay');

    if (label) {
        const parent = label.parentNode;
        parent?.removeChild(label);
    }

    if (arUI) arUI.style.display = 'none';
    if (exitButton) exitButton.style.display = 'none';
    if (clearObjects) clearObjects.style.display = 'none';
    if (menuContainer) menuContainer.style.display = 'none';
    if (openPanel) {openPanel.style.display = 'flex'};
    if (resetOverlay) {resetOverlay.style.display = 'flex'};

    // 初回表示ロジックの変数をリセット
    reticleShowTimeRef.current = null;
    viewNumRef.current = 0;

    console.log("Session cleanup complete.");
}
