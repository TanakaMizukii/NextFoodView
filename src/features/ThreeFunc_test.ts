import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export type ThreeCtx = {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls?: OrbitControls;
    dispose: () => void;
};

export type InitOptions = {
    pixelRatioCap?: number; // モバイル負荷対策
    alpha?: boolean;
    antialias?: boolean;
    useControls?: boolean;
}

/** Three.js 初期化（canvas必須） */
export function initThree(canvas: HTMLCanvasElement, opts: InitOptions = {}): ThreeCtx {
    // デフォルト値を分割代入にて設定(もし値がなかった時自動的に入る)
    const {
        pixelRatioCap = 2,
        alpha = false,
        antialias = true,
        useControls = false,
    } = opts;
    console.log(opts);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias,
        alpha, // 透過
        powerPreference: "high-performance",
    });

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(70, 1, 1, 1000);
    camera.position.set(0, 3, 3);
    camera.lookAt(0, 0, 0);

    // 簡易ライト
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(3, 5, 2);
    scene.add(ambient, dir);

    let controls: OrbitControls | undefined;
    if (useControls) {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
    }

    // DevicePixelRatio制限(初期値１)
    const dpr = Math.min(window.devicePixelRatio || 1, pixelRatioCap);
    renderer.setPixelRatio(dpr);

    // クリーンナップ関数
    const dispose = () => {
        renderer.dispose();
        controls?.dispose();
        scene.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            mesh.geometry?.dispose?.();
            const mat = (mesh).material;
            if (mat) {
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose?.());
            else mat.dispose?.();
            }
        });
    };

    return { renderer, scene, camera, controls, dispose };
}

/** DPRを再適用（回転等でDPRが変わる端末対策用） */
export function refreshPixelRatio(renderer: THREE.WebGLRenderer, cap = 2) {
    const dpr = Math.min(window.devicePixelRatio || 1, cap);
    renderer.setPixelRatio(dpr);
}

/** 親要素サイズにフィットさせる */
export function resizeToContainer(ctx: ThreeCtx, container: HTMLElement) {
    const width = container.clientWidth;
    const height = container.clientHeight || 1; // 0除け
    ctx.camera.aspect = width / height;
    ctx.camera.updateProjectionMatrix();
    ctx.renderer.setSize(width, height, false);
}

/** ResizeObserver + window.resize をまとめてセットアップ */
export function attachResizeHandlers(ctx: ThreeCtx, container: HTMLElement, opts?: { pixelRatioCap?: number }) {
    const onResize = () => {
        refreshPixelRatio(ctx.renderer, opts?.pixelRatioCap ?? 2);
        resizeToContainer(ctx, container);
    };
    // ResizeObserver(関数)は指定した要素の親要素のサイズ変化を感知して設置した関数を発動するブラウザAPI。
    const ro = new ResizeObserver(onResize);
    // .observe(targetElement)にて監視対象の要素を登録。引数にはHTMLElement(div,canvas)などを渡す。
    ro.observe(container);
    window.addEventListener("resize", onResize, { passive: true });

    // 初回適用
    onResize();

    // これはクリーンナップ関数というもので、1,コンポーネントがDOMから完全に削除されるとき
    // 2, 依存配列の値が変わるとき（useEffect(..., [依存値]) の依存値が変化して再実行される前）
    // つまり、useEffectが次に実行される前に必ず呼ばれる処理である。
    return () => {
        // 監視対象を完全に解除するメソッド
        ro.disconnect();
        window.removeEventListener("resize", onResize);
    };
}