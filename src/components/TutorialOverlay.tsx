import styled from "styled-components";

type TutorialOverlayProps = {
    isVisible: boolean;
    onClose?: () => void;
};

export default function TutorialOverlay({ isVisible, onClose }: TutorialOverlayProps) {
    return(
        <MyTutorialOverlay>
            {/* Tutorial Overlay */}
            <div className={`tutorial-overlay ${isVisible ? 'show' : ''}`}>
                <div className="tutorial-content">
                    <h3>操作方法</h3>
                    <div className="tutorial-gestures">
                        <div className="gesture-item">
                            <div className="gesture-icon">👆</div>
                            <div className="gesture-text">1本指ドラッグ = 回転</div>
                        </div>
                        <div className="gesture-item">
                            <div className="gesture-icon">✌️</div>
                            <div className="gesture-text">2本指 = パン移動</div>
                        </div>
                        <div className="gesture-item">
                            <div className="gesture-icon">🤏</div>
                            <div className="gesture-text">ピンチ = ズーム</div>
                        </div>
                    </div>
                    <button className="tutorial-button" onClick={onClose}>
                        始める
                    </button>
                </div>
            </div>
        </MyTutorialOverlay>
    )
};

const MyTutorialOverlay = styled.div`
    .tutorial-overlay {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.55);
        align-items: center;
        justify-content: center;
        z-index: 0;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s;

        &.show {
            opacity: 1;
            z-index: 1001;
        }

        .tutorial-content {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 20px;
            padding: 32px;
            max-width: 320px;
            text-align: center;
            color: white;
            pointer-events: auto;

            h3 {
                font-size: 24px;
                margin-bottom: 20px;
            }

            .tutorial-gestures {
                display: flex;
                flex-direction: column;
                gap: 16px;
                margin-bottom: 24px;
                text-align: left;

                .gesture-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;

                    .gesture-icon {
                        width: 40px;
                        height: 40px;
                        background: rgba(255,255,255,0.1);
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 20px;
                    }

                    .gesture-text {
                        flex: 1;
                        font-size: 14px;
                        opacity: 0.9;
                    }
                }
            }

            .tutorial-button {
                width: 100%;
                padding: 14px;
                background: #667eea;
                border: none;
                border-radius: 12px;
                color: white;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                min-height: 48px;
            }
        }
    }
`;