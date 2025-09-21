import type { ThreeCtx } from './ThreeInit';
import type { RefObject } from 'react';
import * as THREE from 'three';
import { disposeModel } from './ThreeLoad';

export function handleSessionEndCleanup(
    ctx: ThreeCtx | null,
    nowModelRef: RefObject<THREE.Group | null>,
    reticleShowTimeRef: RefObject<DOMHighResTimeStamp | null>,
    viewNumRef: RefObject<number>
) {
    if (ctx) {
        // 1. Reticleをシーンから削除
        ctx.scene.remove(ctx.reticle);
        ctx.transControls.detach();

        // 2. 表示されているモデルを削除・メモリ解放
        if (nowModelRef.current) {
            disposeModel(nowModelRef.current); // Dispose geometry/materials
            ctx.scene.remove(nowModelRef.current); // Remove from scene
            nowModelRef.current = null;
        }
        // objectListもクリア
        ctx.objectList.length = 0;
        // TransformControlsも削除
        ctx.transControls.detach();
    }

    // 3. UIを復元
    const label = document.getElementById('label');
    const arUI = document.getElementById('ar-ui');
    const exitButton = document.getElementById('exit-button');
    const clearObjects = document.getElementById('clear-objects');
    const menuContainer = document.getElementById('menu-container');
    const startOverlay = document.getElementById('start-overlay');

    if (label) {
        const parent = label.parentNode;
        parent?.removeChild(label);
    }
    if (arUI) arUI.style.display = 'none';
    if (exitButton) exitButton.style.display = 'none';
    if (clearObjects) clearObjects.style.display = 'none';
    if (menuContainer) menuContainer.style.display = 'none';
    if (startOverlay) startOverlay.style.display = 'flex'; // StartPanelを再表示

    // 4. 初回表示ロジックの変数をリセット
    reticleShowTimeRef.current = null;
    viewNumRef.current = 0;

    console.log("Session cleanup complete.");
}
