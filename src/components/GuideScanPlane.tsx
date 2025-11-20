import styled from "styled-components";

type Props = { visible?: boolean };

export default function GuideScanPlane({ visible = true }: Props) {
    return (
        <MyGuidePlane data-show={visible ? "1" : "0"}>
        <div id="scanning-overlay" className="scanning-overlay">
            <div className="scanning-icon"></div>
            <div className="scanning-text">平面を検出中...</div>

            {/* ▼ 机＋スマホの簡易イラスト */}
            <div className="scan-visual">
            <svg viewBox="0 0 320 160" className="desk-svg" aria-hidden>
                {/* 机の台形（外周） */}
                <path
                d="M40 110 L95 50 L225 50 L280 110 Z"
                className="desk-outline"
                fill="none"
                />
                {/* 机の上面（うっすら） */}
                <path
                d="M70 100 L105 70 L220 70 L252 100 Z"
                className="desk-inner"
                fill="none"
                />
            </svg>

            <div className="sweep-group">
                <div className="phone">
                <div className="phone-notch" />
                <div className="phone-home" />
                </div>
                {/* spark は group の中へ移動 */}
                <span className="spark spark-1" />
                <span className="spark spark-2" />
                <span className="spark spark-3" />
            </div>
            </div>

            <div className="scanning-instruction">
                スマホを目の高さで持ち<br />
                上下左右に動かして平面を<br />
                スキャンしてください
            </div>
        </div>
        </MyGuidePlane>
    );
}

const MyGuidePlane = styled.div`
    /* ====== オーバーレイ本体 ====== */
    .scanning-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: none; /* data-showで切替 */
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 500;
        color: #fff;
        text-align: center;
        padding: 20px;
        box-sizing: border-box;
        user-select: none;
        -webkit-user-select: none;
    }
    &[data-show="1"] .scanning-overlay {
        display: flex;
    }
    .scanning-icon {
        width: 80px;
        height: 80px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%; position: relative;
        margin-bottom: 30px;
        animation: pulse 2s ease-in-out infinite;
    }
        .scanning-icon::before {
        content: '';
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 40px; height: 40px;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>') no-repeat center; background-size: contain;
    }

    .scanning-text {
        font-size: 20px;
        margin-bottom: 14px;
        font-weight: 700;
        letter-spacing: 0.02em;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
    }

    /* ====== 机のビジュアル ====== */
    .scan-visual {
        position: relative;
        width: min(76vw, 360px);
        height: auto;
        aspect-ratio: 320 / 160; /* SVGと合わせる */
        margin: 6px auto 10px;
    }
    .desk-svg {
        width: 100%;
        height: 100%;
        display: block;
    }
    .desk-outline {
        stroke: rgba(255, 255, 255, 0.9);
        stroke-width: 3;
        stroke-linejoin: round;
        filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.25));
    }
    .desk-inner {
        stroke: rgba(255, 255, 255, 0.45);
        stroke-width: 2.5;
        stroke-dasharray: 6 8;
    }

    /* ====== スマホ（矩形） ====== */
    .phone {
        position: absolute;
        /* 机の前縁（左の角：x=40,y=110 〜 右の角：x=280,y=110）に沿って動かす。
        コンテナは 320x160。% で補正しつつ少し上に浮かせて見せる。 */
        left: calc(12.5% - 16px); /* 40/320=12.5% から端末幅の半分を引く */
        top: calc(80% - 50px);  /* 110/160=68.75% 付近 */
        width: 32px;
        height: 56px;
        border: 2px solid #fff;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.8);
        animation: phoneSweep 10.0s ease-in-out infinite;
        transform-origin: 50% 70%;
        box-shadow: 0 0 8px rgba(255, 255, 255, 0.25);
    }
    .phone-notch {
        position: absolute;
        top: 6px;
        left: 50%;
        width: 18px;
        height: 3px;
        background: #fff;
        border-radius: 2px;
        transform: translateX(-50%);
    }
    .phone-home {
        position: absolute;
        bottom: 6px;
        left: 50%;
        width: 10px;
        height: 10px;
        background: #fff;
        border-radius: 50%;
        transform: translateX(-50%);
    }

    /* 上下左右へ往復 */
    @keyframes phoneSweep {
        /* 左右の動き */
        0% {
            transform: translate(100px, 0px) rotateY(0deg);
        }
        15% {
            transform: translate(200px, -2px) rotateY(15deg);
        }
        45% {
            transform: translate(0px, -6px) rotateY(15deg);
        }
        60% {
            transform: translate(100px, 0px) rotateY(0deg);
        }
        /* 上下の動き */
        80% {
            /* Y方向に動かす。少し中央に寄せる */
            transform: translate(100px, -75px) rotateY(5deg);
        }
        100% {
            transform: translate(100px, 0px) rotateY(0deg);
        }
    }

    /* ====== きらきら粒子 ====== */
    .spark {
        position: absolute;
        width: 6px;
        height: 6px;
        background: #fff;
        border-radius: 50%;
        opacity: 0;
        filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.6));
        animation: sparkle 1.8s ease-in-out infinite;
    }
    .spark-1 {
        left: 68%;
        top: 52%;
        animation-delay: 0s;
    }
    .spark-2 {
        left: 74%;
        top: 56%;
        width: 4px;
        height: 4px;
        animation-delay: 0.35s;
    }
    .spark-3 {
        left: 80%;
        top: 50%;
        width: 5px;
        height: 5px;
        animation-delay: 0.7s;
    }
    @keyframes sparkle {
        0% {
        opacity: 0;
        transform: scale(0.6);
        }
        30% {
        opacity: 1;
        transform: scale(1);
        }
        100% {
        opacity: 0;
        transform: scale(0.4) translateY(-6px);
        }
    }

    .scanning-instruction {
        font-size: 18px;
        opacity: 0.9;
        max-width: 320px;
        line-height: 1.55;
    }
`;
