import { THREEx } from "@ar-js-org/ar.js-threejs";
import { Camera, Scene, Group} from "three";

export type ARToolkitInitOptions = {
    domElement: HTMLCanvasElement;
    camera: Camera;
    cameraParaDatURL: string;
    markerPatternURL: string;
    scene: Scene;
};

export const UseARToolkit = ({ domElement, camera, cameraParaDatURL, markerPatternURL, scene}: ARToolkitInitOptions) => {
    const arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: "webcam",
        sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480,
        sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640,
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
            setTimeout(() => {
                arResize();
            }, 400);
        },
        () => {}
    );

    window.addEventListener("resize", function () {
        arResize();
    });

    function arResize() {
        arToolkitSource.onResizeElement();
        arToolkitSource.copyElementSizeTo(domElement);
        if (window.arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(
            window.arToolkitContext.arController.canvas
        );
        }
    }

    function initARContext() {
        arToolkitContext.init(() => {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());

        arToolkitContext.arController.orientation = getSourceOrientation();
        arToolkitContext.arController.options.orientation =
            getSourceOrientation();
        });
        window.arToolkitContext = arToolkitContext;
    }

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
        lerpPosition: .4,  // ポジションの線形補完係数（値が大きいほど動きが急になる）0 〜 1が入る
        lerpQuaternion: .3,  // 角度の補完係数（値が大きいほど動きが急になる）0 〜 1が入る
        lerpScale: 1, // 大きさの線形補完係数（値が大きいほど動きが急になる）0 〜 1が入る
        lerpStepDelay: 1 / 60,  // ステップ間の待機時間（値が大きいほどカクカク動く）
        minVisibleDelay: 0.0,  // マーカーを認識してからオブジェクトを表示するまでの待機時間
        minUnvisibleDelay: 0.2, // マーカーの認識が切れてからオブジェクトを非表示にするまでの待機時間
    });

    function getSourceOrientation(): string {
        return arToolkitSource.domElement.videoWidth >
        arToolkitSource.domElement.videoHeight
        ? "landscape" : "portrait";
    }

    return { arToolkitSource, arToolkitContext, arMarkerControls,
        markerRoot, smoothedRoot, smoothedControls,};
};