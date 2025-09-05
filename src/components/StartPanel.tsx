import styled from "styled-components";

type StartPanelProps = {
    onUpdate: () => void;
    loading: boolean;
}

export default function StartPanel({ onUpdate, loading }: StartPanelProps) {
    const handleClick = () => {
        onUpdate();
    };

    return(
        // <!-- スタートパネル -->
        <MyStart>
            <div id="start-overlay" className='startOverlay'>
                <div id="status-text" className='startText'>ARエクスペリエンスを開始</div>
                    <button id="start-button" className='startButton' onClick={handleClick} disabled={loading}>
                        {loading ? '判定中…' : 'AR体験を始める'}
                    </button>
                <div id="loading-spinner" className='loadingSpinner' style={{ display: loading ? 'block' : 'none' }} />
            </div>
        </MyStart>
    )
}

const MyStart = styled.div`
/* app/landing.module.css */
.startOverlay {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    transition: opacity 0.3s ease;
    background-color: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.statusText {
    color: white;
    font-size: 16px;
    margin-bottom: 20px;
    text-align: center;
}

.startButton {
    background: white;
    color: #333;
    padding: 20px 40px;
    border-radius: 50px;
    font-size: 18px;
    font-weight: bold;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    border: none;
    cursor: pointer;
    min-width: 250px;
}

.startButton:hover {
    transform: scale(1.05);
}

.loadingSpinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255,255,255,0.3);
    border-top: 3px solid #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 20px auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`