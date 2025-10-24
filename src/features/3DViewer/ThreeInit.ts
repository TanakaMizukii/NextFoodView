import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import { KTX2Loader } from 'three/examples/jsm/Addons.js';
import { PMREMGenerator } from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
await MeshoptDecoder.ready;

export type ThreeCtx = {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
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
        alpha = false,
        antialias = true,
        useControls = false,
    } = opts;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias,
        alpha, // 透過
        powerPreference: "high-performance",
    });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);

    const camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    camera.position.set(16, 22, 20);

    // 簡易ライト
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set( 1, 1, 1);
    scene.add(light);

    // 詳細画面表示用のRendererの作成
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.id = 'label';
    document.body.appendChild(labelRenderer.domElement);

    let controls: OrbitControls | undefined;
    if (useControls) {
        controls = new OrbitControls(camera, labelRenderer.domElement);
        controls.enableDamping = true;
        controls.target.set(0, 0, 0);
    }

    // モデルデータを読み込むためのローダーを作成
    // KTX2を準備
    const ktx2 = new KTX2Loader();
    ktx2.setTranscoderPath('/basis/');
    // WebGPUは非同期で初期化されるため、KTX2Loaderの設定前にレンダラーの初期化を待つ必要がある。
    // rendererを初期化
    // await renderer.init();
    ktx2.detectSupport(renderer);
    const loader = new GLTFLoader();
    loader.setKTX2Loader(ktx2);
    loader.setMeshoptDecoder(MeshoptDecoder);

    // マウスの位置を格納するベクトルを作成
    const mouse = new THREE.Vector2(-100, -100); // 初期値を画面外に設定
    // レイキャストの作成(初期値の設定)
    const raycaster = new THREE.Raycaster();
    const detailNum = 0;
    const objectList: never[] = [];

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
            const mat = mesh.material;
            if (mat) {
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose?.());
            else mat.dispose?.();
            }
        });
    };

    const pmrem = new PMREMGenerator(renderer);
    new RGBELoader()
    .setPath('/hdr/')
    .load('11zon_forest.hdr', (hdr) => {
        const envTex = pmrem.fromEquirectangular(hdr).texture;
        scene.environment = envTex;
        scene.background = envTex;
        hdr.dispose();
    });

    return { renderer, scene, camera, controls, labelRenderer,loader, mouse, raycaster, detailNum, objectList, dispose };
}

/** リサイズ処理 ResizeObserver + window.resize をまとめてセットアップ */
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
    ctx.labelRenderer.setSize(width, height);
}