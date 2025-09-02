import styled from "styled-components"

export default function GuideQRCode() {
    return(
        // <!-- ガイド用インジケーター -->
        <MyGuideQR>
            <div id="guideMarker" className="guide-overlay">
                <div className="guide-spinner" />
                <div className="guide-text">QRコードにかざしてください…<br/>商品を表示します</div>
            </div>
        </MyGuideQR>
    )
}

const MyGuideQR = styled.div`
/* ガイド用インジケーター */
.guide-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
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
    opacity: 0.8;
    pointer-events: all;
}

.guide-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
}

.guide-text {
    color: white;
    font-size: 25px;
    text-align: center;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`