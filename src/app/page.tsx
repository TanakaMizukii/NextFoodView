'use client';

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { getMobileOS } from "../lib/detectOS";
import { checkImmersiveARSupport } from "../lib/checkWebXR";
import styles from "./page.module.css";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = useCallback(async() => {
    setLoading(true);
    const os = getMobileOS();
    const xr = await checkImmersiveARSupport();

    // 分岐方針：
    if (os === 'ios') {
      router.push(xr === 'supported' ? '/threeAR': '/arJS');
    } else if (os === 'android') {
      router.push(xr === 'supported' ? '/threeAR': '/arJS');
    }
    else router.push('/viewer');
  }, [router]);

  return (
    <div id="start-overlay" className={styles.startOverlay}>
      <div id="status-text" className={styles.startText}>ARエクスペリエンスを開始</div>
      <button id="start-button" className={styles.startButton} onClick={handleStart} disabled={loading}>
        {loading ? '判定中…' : 'AR体験を始める'}
      </button>
      <div id="loading-spinner" className={styles.loadingSpinner} style={{ display: loading ? 'block' : 'none' }} />
    </div>
  );
}
