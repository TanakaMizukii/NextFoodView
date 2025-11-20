'use client';

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { getMobileOS } from "../../lib/detectOS";
import { checkImmersiveARSupport } from "../../lib/checkWebXR";
import MenuContainer from '@/components/MenuContainer';
import { ModelChangeContext } from '@/contexts/ModelChangeContext';
import dynamic from 'next/dynamic';
import '../App.css';
import ARStartPanel from "@/components/ARStartPanel";

type ModelInfo = { modelName?: string; modelPath?: string; modelDetail?: string; modelPrice?: string; };
type ChangeModelFn = (info: ModelInfo) => Promise<void>;

// ThreeMainコンポーネントをdynamic importに書き換えてハイドレーションエラーが起きないようにする。
const ThreeMain = dynamic(() => import('@/features/WebXR/ThreeMain'), {
    ssr: false, // サーバーサイドレンダリングを無効化
});

export default function LandingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [start, setStart] = useState(false);
    const [changeModel, setChangeModel] = useState<ChangeModelFn>(() => async (info: ModelInfo) => {
        console.warn("changeModel is not yet initialized", info);
    });

    const handleStart = useCallback(async() => {
        setLoading(true);
        const os = getMobileOS();
        const xr = await checkImmersiveARSupport();

        if (os === 'android' || os === 'ios') { // 最後にar可能かどうかの分岐処理を付ける
            router.push(xr === 'supported' ? '/arView' : '/arJS');
            if (xr === 'supported') {setStart(true)}
        } else {
            router.push('/viewer');
            alert('デスクトップではAR表示はできません。スマートフォンにて起動をお願いします。')
        }
    }, [router]);

    const handleSessionEnd = () => {
        setStart(false);
        setLoading(false);
    };

    return (
        <>
        <ARStartPanel onUpdate={handleStart} loading={loading} />
        {start &&
            <ModelChangeContext.Provider value={{ changeModel }}>
                <ThreeMain setChangeModel={setChangeModel} startAR={start} onSessionEnd={handleSessionEnd}/>
                <MenuContainer />
            </ModelChangeContext.Provider>
        }
        </>
    );
}
