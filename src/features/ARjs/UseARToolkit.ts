import { THREEx } from "@ar-js-org/ar.js-threejs";
import { Camera, Scene, Group} from "three";

export type ARToolkitInitOptions = {
    domElement: HTMLCanvasElement;
    camera: Camera;
    cameraParaDatURL: string;
    markerPatternURL: string;
    scene: Scene;
    markerRoot: Group;
};

export const UseARToolkit = ({ domElement, camera, cameraParaDatURL, markerPatternURL, markerRoot}: ARToolkitInitOptions) => {
    const arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: "webcam",
        sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480,
        sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640,
    });

    const arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: cameraParaDatURL,
        detectionMode: "mono",
    });

    arToolkitSource.init(
        () => {
        arToolkitSource.domElement.addEventListener("canplay", () => {
            initARContext();
        });
        document.getElementById('wrapper')?.appendChild(arToolkitSource.domElement); // DOMを移動する
        window.arToolkitSource = arToolkitSource;
        setTimeout(() => {
            onResize();
        }, 400);
        },
        () => {}
    );

    window.addEventListener("resize", function () {
        onResize();
    });

    function onResize() {
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

        arToolkitContext.arController.orientatio = getSourceOrientation();
        arToolkitContext.arController.options.orientation =
            getSourceOrientation();

        window.arToolkitContext = arToolkitContext;

        const arMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot,
            {
                type: "pattern",
                patternUrl: markerPatternURL,
            }
        );
        window.arMarkerControls = arMarkerControls;
        });
    }

    function getSourceOrientation(): string {
        return arToolkitSource.domElement.videoWidth >
        arToolkitSource.domElement.videoHeight
        ? "landscape" : "portrait";
    }

    return { arToolkitSource, arToolkitContext, markerRoot};
};