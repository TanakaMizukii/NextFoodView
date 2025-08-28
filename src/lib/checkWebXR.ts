// lib/checkWebXR.ts
export type XRSupport = 'supported' | 'not_supported' | 'unknown';

export async function checkImmersiveARSupport(): Promise<XRSupport> {
    // Secure Context でのみ機能（https or localhost）
    if (typeof window === 'undefined' || !('isSecureContext' in window) || !window.isSecureContext) {
        return 'not_supported';
    }
    // navigator.xr の存在確認
    interface XR {
        isSessionSupported: (mode: string) => Promise<boolean>;
    }
    const xr = (navigator as { xr?: XR }).xr;
    if (!xr || typeof xr.isSessionSupported !== 'function') {
        return 'not_supported';
    }
    try {
        // 'immersive-ar' セッションがサポートされているか
        const ok = await xr.isSessionSupported('immersive-ar');
        return ok ? 'supported' : 'not_supported';
    } catch {
        return 'unknown';
    }
}
