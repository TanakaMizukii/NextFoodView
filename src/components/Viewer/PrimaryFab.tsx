import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getMobileOS } from "@/lib/detectOS";
import { checkImmersiveARSupport } from "@/lib/checkWebXR";

export default function PrimaryFab() {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleARStart = async () => {
        setIsLoading(true);
        const os = getMobileOS();
        const xr = await checkImmersiveARSupport();

        if (os === 'android' || os === 'ios') {
            router.push(xr === 'supported' ? '/arView' : '/arJS');
        } else {
            router.push('/viewer');
            alert('デスクトップではAR表示はできません。スマートフォンにて起動をお願いします。');
        }
        setIsLoading(false);
    }

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    }

    return(
        <MyFabContainer>
            {/* Expanded content */}
            <div className={`expanded-content ${isExpanded ? 'visible' : ''}`}>
                <h6 className="explanation-title">AR（拡張現実）</h6>
                <p className="explanation-text">カメラを起動することで、商品を実際の大きさで確認できます</p>
                <button className="ar-start-button" onClick={handleARStart} disabled={isLoading}>
                    {isLoading ? '確認中...' : 'ARを開始'}
                </button>
            </div>

            {/* Primary FAB */}
            <button className="primary-fab" onClick={toggleExpand}>
                {isExpanded ? '×' : 'AR'}
            </button>
        </MyFabContainer>
    )
};

const MyFabContainer = styled.div`
    position: absolute;
    top: 160px;
    right: 20px;
    z-index: 10;
    display: flex;
    flex-direction: row;
    align-items: center;

    /* Expanded Content */
    .expanded-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(10px);
        padding: 16px;
        border-radius: 12px;
        width: 220px;
        margin-right: 16px;
        opacity: 0;
        transform: translateX(10px) scale(0.95);
        transition: opacity 0.2s ease-out, transform 0.2s ease-out;
        pointer-events: none;
    }

    .expanded-content.visible {
        opacity: 1;
        transform: translateX(0) scale(1);
        pointer-events: auto;
    }

    .explanation-title {
        color: white;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
    }

    .explanation-text {
        color: white;
        font-size: 14px;
        text-align: left;
        margin: 0;
        margin-bottom: 12px;
    }

.ar-start-button {
    background: linear-gradient(135deg, #4ade80, #22c55e); /* 明るいライム系 */
    color: #ffffff;
    border: none;
    border-radius: 14px;
    padding: 14px 20px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.20s ease;
    width: 100%;
    box-shadow: 0 6px 18px rgba(34, 197, 94, 0.35);
}

/* ホバー時：軽く光る → 押したくなる */
.ar-start-button:hover:not(:disabled) {
    background: linear-gradient(135deg, #5ef08e, #31d971);
    box-shadow: 0 8px 22px rgba(34, 197, 94, 0.45);
    transform: translateY(-1px);
}

/* disabled も視認性UP */
.ar-start-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}


/* Primary FAB - 単色レッド版 */
.primary-fab {
    width: 64px;
    height: 64px;
    background: #ff4d4d;  /* 単色で一番押される赤 */
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 26px;
    font-weight: 700;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    /* 押されやすいよう影は赤寄りに */
    box-shadow: 0 8px 24px rgba(255, 80, 80, 0.45);

    transition: all 0.22s ease-out;

    position: relative;
    flex-shrink: 0;
}

/* ホバー時 - 微妙に明るくして誘導 */
.primary-fab:hover:not(:disabled) {
    background: #ff5f5f;
    box-shadow: 0 10px 28px rgba(255, 80, 80, 0.55);
    transform: translateY(-2px);
}

/* クリック時 */
.primary-fab:active {
    transform: scale(0.92);
    box-shadow: 0 6px 20px rgba(255, 80, 80, 0.35);
}

/* 無効化 */
.primary-fab:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

`