import type { ArToolkitContext as Ctx } from '@ar-js-org/ar.js-threejs/types/ArToolkitContext';
import type { ArToolkitSource as Src } from '@ar-js-org/ar.js-threejs/types/ArToolkitSource';
import type { ArSmoothedControls as Smooth } from '@ar-js-org/ar.js-threejs/types/ArSmoothedControls';

declare global {
    namespace THREEx {
        // 公式型へのエイリアス（= 同一型として扱える）
        type ArToolkitContext = Ctx;
        type ArToolkitSource = Src;
        type ArSmoothedControls = Smooth;

        interface ArMarkerControls {
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
        }
    }
}
export {};