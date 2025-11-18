import { THREEx } from "@ar-js-org/ar.js-threejs";
import { Camera, Scene, Group} from "three";

export type ARToolkitInitOptions = {
    domElement: HTMLCanvasElement;
    camera: Camera;
    cameraParaDatURL: string;
    markerPatternURL: string;
    scene: Scene;
    onCameraReady?: () => void;
};

export const UseARToolkit = ({ domElement, camera, cameraParaDatURL, markerPatternURL, scene, onCameraReady}: ARToolkitInitOptions) => {
    // @ts-expect-error 型定義では必須だが、解像度自動選択のために意図的に省略
    const arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: "webcam",
    });

    const arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: cameraParaDatURL,
        patternRatio: 0.6,
        detectionMode: "mono_and_matrix",
    });

    arToolkitSource.init(
        () => {
        arToolkitSource.domElement.addEventListener("canplay", () => {
            initARContext();
        });
        document.getElementById('wrapper')?.appendChild(arToolkitSource.domElement); // DOMを移動する
        window.arToolkitSource = arToolkitSource;
        },
        () => {}
    );

    function initARContext() {
        arToolkitContext.init(() => {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());

        arToolkitContext.arController.orientation = getSourceOrientation();
        arToolkitContext.arController.options.orientation =
            getSourceOrientation();
        });
        onCameraReady?.();
        arResize();
        window.arToolkitContext = arToolkitContext;
    }

    function arResize() {
        arToolkitSource.onResizeElement();
        arToolkitSource.copyElementSizeTo(domElement);
    }
    window.addEventListener("resize", arResize);

    const markerRoot = new Group();
    const smoothedRoot = new Group();
    scene.add(markerRoot, smoothedRoot);

    const arMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot,
        {
            type: "pattern",
            patternUrl: markerPatternURL,
        }
    );
    window.arMarkerControls = arMarkerControls;
    // SmoothedControlsを追加
    const smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot, {
        lerpPosition: 0.4,  // ポジションの線形補完係数（値が大きいほど動きが急になる）0 〜 1が入る
        lerpQuaternion: 0.4,  // 角度の補完係数（値が大きいほど動きが急になる）0 〜 1が入る
        lerpScale: 0.4, // 大きさの線形補完係数（値が大きいほど動きが急になる）0 〜 1が入る
        lerpStepDelay: 1 / 60,  // ステップ間の待機時間（値が大きいほどカクカク動く）
        minVisibleDelay: 0.1,  // マーカーを認識してからオブジェクトを表示するまでの待機時間
        minUnvisibleDelay: 0.3, // マーカーの認識が切れてからオブジェクトを非表示にするまでの待機時間
    });

    function getSourceOrientation(): string {
        return arToolkitSource.domElement.videoWidth >
        arToolkitSource.domElement.videoHeight
        ? "landscape" : "portrait";
    }

    return { arToolkitSource, arToolkitContext, arMarkerControls,
        markerRoot, smoothedRoot, smoothedControls,};
};