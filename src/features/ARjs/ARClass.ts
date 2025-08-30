// src/features/ARjs/ARClass.ts
import * as THREE from 'three';
import { THREEx } from "@ar-js-org/ar.js-threejs";

export class ARjs {
    public arToolkitContext: any;
    public arToolkitSource: any;
    public arMarkerControls: any;
    public smoothedControls: any;
    public smoothedRoot: THREE.Group;
    public markerRoot: THREE.Group;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    constructor(camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, onReady: () => void) {
        this.camera = camera;
        this.renderer = renderer;
        THREEx.ArToolkitContext.baseURL = "./";

        this.arToolkitSource = new THREEx.ArToolkitSource({
            sourceType: 'webcam',
            sourceWidth: window.innerWidth,
            sourceHeight: window.innerHeight,
        });

        this.arToolkitContext = new THREEx.ArToolkitContext({
            cameraParametersUrl: '/data/camera_para.dat',
            patternRatio: 0.6,
            detectionMode: 'mono_and_matrix',
        });

        this.smoothedRoot = new THREE.Group();
        scene.add(this.smoothedRoot);
        this.smoothedControls = new THREEx.ArSmoothedControls(this.smoothedRoot, {
            lerpPosition: .8,
            lerpQuaternion: .2,
            lerpScale: 0.7,
            lerpStepDelay: 1 / 60,
            minVisibleDelay: 0.0,
            minUnvisibleDelay: 0.2,
        });

        this.arToolkitContext.init(() => {
            camera.projectionMatrix.copy(this.arToolkitContext.getProjectionMatrix());
            camera.layers.enable(1);

              // ← ここで MarkerControls を作る
            this.markerRoot = new THREE.Group();
            scene.add(this.markerRoot);
            this.arMarkerControls = new THREEx.ArMarkerControls(this.arToolkitContext, this.markerRoot, {
                type:'pattern',
                patternUrl:'/data/patt.hiro',
            });
        });

        this.arToolkitSource.init(() => {
            const video = this.arToolkitSource.domElement;
            video.style.position = 'absolute';
            video.style.top = '0px';
            video.style.left = '0px';
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            video.style.zIndex = '-1'; // canvasの後ろに配置
            document.querySelector('#wrapper')?.appendChild(video);

            setTimeout(() => this.onResize(), 0);
            onReady();
        }, (onError: any) => {
            console.error("AR.js source initialization failed", onError);
        });

        window.addEventListener('resize', this.onResize.bind(this));
    }

    public onResize() {
        if (this.arToolkitSource && this.renderer) {
            this.arToolkitSource.onResize();
        }
    }

    public update() {
        // Source が ready でなければ何もしない
        if (!this.arToolkitSource || this.arToolkitSource.ready === false) return;

        // arController（= マーカー登録の受け皿）が出来ていなければ何もしない
        if (!(this.arToolkitContext as any)?.arController) return;

        try {
            this.arToolkitContext.update(this.arToolkitSource.domElement);
            this.smoothedControls.update(this.markerRoot);
        } catch (e) {
            console.error('AR.js update failed:', e);
        }
    }

    public dispose() {
        window.removeEventListener('resize', this.onResize.bind(this));
        if (this.arToolkitSource && this.arToolkitSource.domElement) {
            const video = this.arToolkitSource.domElement;
            video.srcObject?.getTracks().forEach((track: any) => track.stop());
            video.parentElement?.removeChild(video);
        }
    }
}
