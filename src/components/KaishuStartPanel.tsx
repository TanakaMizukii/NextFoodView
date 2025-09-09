import styled from "styled-components";

type StartPanelProps = {
    onUpdate: () => void;
    loading: boolean;
}

export default function KaishuStartPanel({ onUpdate, loading }: StartPanelProps) {
    const handleClick = () => {
        onUpdate();
    };

    return(
        // <!-- スタートパネル -->
        <MyStart>
            <div id="start-overlay" className={'startOverlay'}>
                <img src="/thumb/海州ロゴ.png" alt="メインイメージ" id="start-image" className={"startImage"} />
                <div id="status-text" className={'startText'}>ARエクスペリエンスを開始</div>
                    <button id="start-button" className={'startButton'} onClick={handleClick} disabled={loading}>
                        {loading ? '判定中…' : 'AR体験を始める'}
                    </button>
                <div id="loading-spinner" className={'loadingSpinner'} style={{ display: loading ? 'block' : 'none' }} />
            </div>
        </MyStart>
    )
}

const MyStart = styled.div`
.startOverlay {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    z-index: 1000;
    transition: opacity 0.5s ease;
    background: #000;
    padding: 20px;
    padding-top: 23vh;
    box-sizing: border-box;
}

.startImage {
    width: 130px;
    height: auto;
    margin-bottom: 25px;
    border-radius: 12px; /* 円形ではなく角丸に */
    object-fit: cover;
    -webkit-user-drag: none;
    user-select: none;
}

.startText {
    color: #f5f5f5; /* オフホワイト */
    font-size: 20px;
    font-family: "Garamond", "Times New Roman", serif;
    margin-bottom: 30px;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0,0,0,0.7);
}

.startButton {
    background: linear-gradient(145deg, #b22222, #800000);
    color: white;
    padding: 18px 45px;
    border-radius: 50px;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 1px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.5), inset 0 -3px 6px rgba(0,0,0,0.3);
    border: 1px solid #b22222;
    cursor: pointer;
    min-width: 280px;
    text-align: center;
    transition: all 0.2s ease-out;
    text-shadow: 0 1px 3px rgba(0,0,0,0.4);
}

.startButton:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.6), inset 0 -3px 6px rgba(0,0,0,0.3);
    background: linear-gradient(145deg, #c23b3b, #991111);
}

.startButton:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 5px 15px rgba(0,0,0,0.5), inset 0 -3px 6px rgba(0,0,0,0.3);
}

.startButton:disabled {
    background: #555;
    color: #999;
    border-color: #666;
    cursor: not-allowed;
}

.loadingSpinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(178, 34, 34, 0.2);
    border-top: 4px solid #b22222;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 20px auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`