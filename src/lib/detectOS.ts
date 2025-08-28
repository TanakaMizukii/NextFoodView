// lib/detectOS.ts
export type MobileOS = 'ios' | 'android' | 'other';

/**
* ユーザーエージェント等から iOS / Android / Other を判定
* - iPadOS 13+ の Mac 偽装 ("Macintosh" && タッチ有り) を iOS として扱う
*/
export function getMobileOS(os?: string): MobileOS {
    const userAgent = (os ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '')) || '';

    if (/Android/i.test(userAgent)) return 'android';
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
    // iPadOS 13+ (Macintosh + タッチ) 対応
    if (/Macintosh/i.test(userAgent) && typeof window !== 'undefined' && 'ontouchend' in window) {
        return 'ios';
    }
    return 'other';
}