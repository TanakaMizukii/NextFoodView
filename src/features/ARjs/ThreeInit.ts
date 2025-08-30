import * as THREE from 'three';
import { ARjs } from './ARClass';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import { KTX2Loader } from 'three/examples/jsm/Addons.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

await MeshoptDecoder.ready;

/** AR.js Init */
export type ThreeCtx = {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    arjs: ARjs; // ARjsインスタンスを追加
    controls?: OrbitControls;
    labelRenderer: CSS2DRenderer;
    loader: GLTFLoader;
    mouse: THREE.Vector2;
    raycaster: THREE.Raycaster;
    detailNum: number;
    objectList: THREE.Object3D[];
    dispose: () => void;
};

export type InitOptions = {
    pixelRatioCap?: number; // モバイル負荷対策
    alpha?: boolean;
    antialias?: boolean;
    useControls?: boolean;
};

/** Three.js 初期化（canvas必須） */
export function initThree(canvas: HTMLCanvasElement, opts: InitOptions = {}): ThreeCtx {
    // デフォルト値を分割代入にて設定(もし値がなかった時自動的に入る)
    const {
        pixelRatioCap = 2,
        alpha = true, // ARでは背景を透過させるためtrue推奨
        antialias = true,
        useControls = false,
    } = opts;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias,
        alpha,
        powerPreference: "high-performance",
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    // 簡易ライト
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(ambientLight, directionalLight);

    // 詳細画面表示用のRendererの作成
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.id = 'label';
    document.body.appendChild(labelRenderer.domElement);

    // AR.jsのセットアップ
    const onReady = () => {
        console.log("AR.js is ready");
    };
    const arjs = new ARjs(camera, scene, renderer, onReady);

    let controls: OrbitControls | undefined;
    if (useControls) {
        controls = new OrbitControls(camera, labelRenderer.domElement);
        controls.enableDamping = true;
    }

    // モデルデータを読み込むためのローダーを作成
    const ktx2 = new KTX2Loader();
    ktx2.setTranscoderPath('./basis/');
    ktx2.detectSupport(renderer);
    const loader = new GLTFLoader();
    loader.setKTX2Loader(ktx2);
    loader.setMeshoptDecoder(MeshoptDecoder);

    const mouse = new THREE.Vector2(-100, -100);
    const raycaster = new THREE.Raycaster();
    const detailNum = 0;
    const objectList: THREE.Object3D[] = [];

    const dpr = Math.min(window.devicePixelRatio || 1, pixelRatioCap);
    renderer.setPixelRatio(dpr);

    const dispose = () => {
        arjs.dispose();
        renderer.dispose();
        controls?.dispose();
        scene.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            mesh.geometry?.dispose?.();
            const mat = mesh.material;
            if (mat) {
                if (Array.isArray(mat)) mat.forEach((m) => m.dispose?.());
                else mat.dispose?.();
            }
        });
        document.body.removeChild(labelRenderer.domElement);
    };

    return { renderer, scene, camera, arjs, controls, labelRenderer, loader, mouse, raycaster, detailNum, objectList, dispose };
}

/** リサイズ処理 */
export function attachResizeHandlers(ctx: ThreeCtx, container: HTMLElement, opts?: { pixelRatioCap?: number }) {
    const onResize = () => {
        refreshPixelRatio(ctx.renderer, opts?.pixelRatioCap ?? 2);
        resizeToContainer(ctx, container); // ARではarjs.onResizeに任せる
        ctx.arjs.onResize(); // AR.jsのリサイズ処理
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    window.addEventListener("resize", onResize, { passive: true });

    onResize();

    return () => {
        ro.disconnect();
        window.removeEventListener("resize", onResize);
    };
}

/** DPRを再適用 */
export function refreshPixelRatio(renderer: THREE.WebGLRenderer, cap = 2) {
    const dpr = Math.min(window.devicePixelRatio || 1, cap);
    renderer.setPixelRatio(dpr);
}

/** 親要素サイズにフィットさせる */
export function resizeToContainer(ctx: ThreeCtx, container: HTMLElement) {
    const width = container.clientWidth;
    const height = container.clientHeight || 1;
    ctx.camera.aspect = width / height;
    ctx.camera.updateProjectionMatrix();
    ctx.renderer.setSize(width, height, false);
    ctx.labelRenderer.setSize(width, height);
}