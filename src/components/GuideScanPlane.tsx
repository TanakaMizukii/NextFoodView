import styled from "styled-components"

export default function GuideScanPlane() {
    return(
        //  <!-- 平面検出待ち画面 -->
        <MyGuidePlane>
            <div id="scanning-overlay" className="scanning-overlay">
                <div className="scanning-icon"></div>
                <div className="scanning-text">平面を検出しています</div>
                <div className="phone-animation"></div>
                <div className="scanning-instruction">
                    スマートフォンをゆっくりと<br/>
                    左右に動かして平面を<br/>
                    スキャンしてください
                </div>
            </div>
        </MyGuidePlane>
    )
}

const MyGuidePlane = styled.div`
/* ガイド用インジケーター */
.scanning-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 500;
    color: white;
    text-align: center;
    padding: 20px;
    box-sizing: border-box;
}
.scanning-icon {
    width: 80px;
    height: 80px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    position: relative;
    margin-bottom: 30px;
    animation: pulse 2s ease-in-out infinite;
}
.scanning-icon::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>') no-repeat center;
    background-size: contain;
}
.scanning-text {
    font-size: 18px;
    margin-bottom: 15px;
    font-weight: bold;
}
.scanning-instruction {
    font-size: 14px;
    opacity: 0.8;
    max-width: 300px;
    line-height: 1.5;
}
`