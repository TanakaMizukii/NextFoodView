import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import { KTX2Loader } from 'three/examples/jsm/Addons.js';
import { UseARToolkit } from './UseARToolkit';
import { PMREMGenerator } from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
await MeshoptDecoder.ready;

/** AR.js Init */
export type ThreeCtx = {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    labelRenderer: CSS2DRenderer;
    loader: GLTFLoader;
    mouse: THREE.Vector2;
    raycaster: THREE.Raycaster;
    detailNum: number;
    objectList: THREE.Object3D[];
    arToolkitContext: THREEx.ArToolkitContext;
    arToolkitSource: THREEx.ArToolkitSource;
    smoothedControls: THREEx.ArSmoothedControls;
    markerRoot: THREE.Group;
    smoothedRoot: THREE.Group;
    dispose: () => void;
};

export type InitOptions = {
    pixelRatioCap?: number; // モバイル負荷対策
    alpha?: boolean;
    antialias?: boolean;
    useControls?: boolean;
};

/** Three.js 初期化（canvas必須） */
export function initThree(canvas: HTMLCanvasElement, opts: InitOptions = {}, onCameraReady?: () => void, onGuideDismiss?: () => void): ThreeCtx {
    // デフォルト値を分割代入にて設定(もし値がなかった時自動的に入る)
    const {
        pixelRatioCap = 2,
        alpha = true, // ARでは背景を透過させるためtrue推奨
        antialias = true,
    } = opts;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias,
        alpha,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    camera.far = 5;

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

    const { arToolkitContext, arToolkitSource, arMarkerControls,
        markerRoot, smoothedRoot, smoothedControls } = UseARToolkit({
        domElement: renderer.domElement,
        camera: camera,
        cameraParaDatURL: '/data/camera_para.dat',
        markerPatternURL: "/data/kaishu3d.patt",
        scene: scene,
        onCameraReady,
    });

    // モデルデータを読み込むためのローダーを作成
    const ktx2 = new KTX2Loader();
    ktx2.setTranscoderPath('/basis/');
    ktx2.detectSupport(renderer);
    const loader = new GLTFLoader();
    loader.setKTX2Loader(ktx2);
    loader.setMeshoptDecoder(MeshoptDecoder);

    const mouse = new THREE.Vector2(-100, -100);
    const raycaster = new THREE.Raycaster();
    const detailNum = 0;
    const objectList: THREE.Object3D[] = [];

    type MarkerControlsWithEvents = THREEx.ArMarkerControls & {
    addEventListener(
        type: 'markerFound' | 'markerLost',
        listener: (ev: Event) => void,
        options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener(
        type: 'markerFound' | 'markerLost',
        listener: (ev: Event) => void,
        options?: boolean | EventListenerOptions
    ): void;
    };
    const mc = arMarkerControls as MarkerControlsWithEvents;

    // 一度マーカーを検知するとガイドを終了
    const onMarkerFound = () => {
        onGuideDismiss?.();
        mc.removeEventListener('markerFound', onMarkerFound);
    };
    mc.addEventListener('markerFound', onMarkerFound);


    const dpr = Math.min(window.devicePixelRatio || 1, pixelRatioCap);
    renderer.setPixelRatio(dpr);

    const dispose = () => {
        // Stop the camera stream
        if (arToolkitSource && arToolkitSource.domElement) {
            const stream = arToolkitSource.domElement.srcObject;
            if (stream instanceof MediaStream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }

        renderer.dispose();
        smoothedRoot.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            mesh.geometry?.dispose?.();
            const mat = mesh.material;
            if (mat) {
                if (Array.isArray(mat)) mat.forEach((m) => m.dispose?.());
                else mat.dispose?.();
            }
        });

        // Remove the label renderer's dom element if it exists
        if (labelRenderer.domElement.parentNode) {
            document.body.removeChild(labelRenderer.domElement);
        }
    };

    const pmrem = new PMREMGenerator(renderer);
    new RGBELoader()
    .setPath('/hdr/')
    .load('11zon_forest.hdr', (hdr) => {
        const envTex = pmrem.fromEquirectangular(hdr).texture;
        scene.environment = envTex;
        hdr.dispose();
    });

    return { renderer, scene, camera, labelRenderer, loader, mouse, raycaster, detailNum, objectList, arToolkitContext, arToolkitSource, smoothedControls, markerRoot, smoothedRoot, dispose };
}

/** リサイズ処理 */
export function attachResizeHandlers(ctx: ThreeCtx, container: HTMLElement, opts?: { pixelRatioCap?: number }) {
    const onResize = () => {
        refreshPixelRatio(ctx.renderer, opts?.pixelRatioCap ?? 2);
        resizeToContainer(ctx, container);
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
    // ctx.camera.aspect = width / height;
    // ctx.camera.updateProjectionMatrix();
    ctx.renderer.setSize(width, height, false);
    ctx.labelRenderer.setSize(width, height);
}