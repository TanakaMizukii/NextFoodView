import styled from "styled-components"

type Props = {
    isVisible: boolean;
}

export default function GuideQRCode({ isVisible }: Props) {
    return(
        // <!-- ガイド用インジケーター -->
        <MyGuideQR>
            <div id="guideMarker" className={`guide-overlay ${isVisible ? 'visible' : ''}`}>
                <div className="guide-hole"></div>
                <div className="guide-text">
                    QRコードの周りにある黒い縁を<br />
                    上の四角に合わせてください
                </div>
                <div className="guide-text">
                    商品の表示を開始します！
                </div>
            </div>
        </MyGuideQR>
    )
}

const MyGuideQR = styled.div`
/* ガイド用インジケーター */
.guide-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.guide-overlay.visible {
    opacity: 1;
    pointer-events: all;
}

/* 中央の穴を作る要素 */
.guide-hole {
    width: 220px;   /* 切り抜きサイズ */
    height: 220px;
    border-radius: 8px;
    top: 40%;
    /* 大きなシャドウで周りを暗くする */
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
    margin-bottom: 70px;
    /* 上にずらす */
    margin-top: -80px;
}

/* テキストは穴の下に */
.guide-text {
    color: #fff;
    font-size: 22px;
    margin-bottom: 10px;
    text-align: center;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

`