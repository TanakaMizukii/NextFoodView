import styled from "styled-components"

interface ARHelperProps {
    onExit: () => void;
    onClear?: () => void;
    onReset?: () => void;
    showClearObjects: boolean;
    showResetHit: boolean;
}

export default function ARHelper({ onExit, onClear, onReset, showClearObjects, showResetHit }: ARHelperProps) {
    return(
        // <!-- AR中のUI -->
        <MyHelper>
            <div id="ar-ui" className="ar-ui">
                <div>AR Mode Active</div>
                <div>商品の選択可能</div>
            </div>

            <button id="exit-button" className="exit-button" onClick={onExit}>AR終了</button>
            {showClearObjects && (
                <div id="clear-objects" className="clear-objects">
                    <button id="clear-button" className="clear-button" onClick={onClear}>♻️</button>
                    <div id="clear-text" className="clear-text">モデルクリア</div>
                </div>
            )}
            {showResetHit && (
                <div id="reset-hit" className="reset-hit">
                    <button id="reset-button" className="reset-button" onClick={onReset}>🔎</button>
                    <div id="reset-text" className="reset-text">平面リセット</div>
                </div>
            )}
        </MyHelper>
    );
}

const MyHelper = styled.div`
.ar-ui {
    position: absolute;
    top: 40px;
    left: 20px;
    width: auto;
    color: white;
    background: rgba(0,0,0,0.7);
    padding: 15px;
    border-radius: 10px;
    font-size: 14px;
    display: none;
    z-index: 100;
}

.exit-button {
    position: absolute;
    top: 40px;
    right: 25px;
    background: rgba(244, 67, 54, 0.8);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    display: none;
    z-index: 100;
}

.clear-objects {
    position: absolute;
    top: 100px;
    right: 22px;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.clear-button {
    width: 56px;
    height: 56px;
    border: none;
    border-radius: 50%;
    background: none;
    color: #fff;
    font-size: 26px;
    line-height: 1;
    text-align: center;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    z-index: 1;
}
.clear-button:hover {
    transform: translateY(-2px) rotate(-15deg);
    box-shadow: 0 6px 16px rgba(0,0,0,0.35);
    background: none;
}
.clear-button:active {
    transform: translateY(0) scale(0.95);
    box-shadow: 0 3px 8px rgba(0,0,0,0.2);
}
.clear-button:focus {
    outline: 2px solid rgba(255,255,255,0.6);
    outline-offset: 3px;
}
.clear-text {
    color: white;
    font-size: 14px;
    text-align: center;
    z-index: 1;
}

.reset-hit {
    position: absolute;
    top: 180px;
    right: 22px;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.reset-button {
    width: 56px;
    height: 56px;
    border: none;
    border-radius: 50%;
    background: none;
    color: #fff;
    font-size: 26px;
    line-height: 1;
    text-align: center;

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    z-index: 1;
}
.reset-button:hover {
    transform: translateY(-2px) rotate(-15deg);
    box-shadow: 0 6px 16px rgba(0,0,0,0.35);
    background: none;
}
.reset-button:active {
    transform: translateY(0) scale(0.95);
    box-shadow: 0 3px 8px rgba(0,0,0,0.2);
}
.reset-button:focus {
    outline: 2px solid rgba(255,255,255,0.6);
    outline-offset: 3px;
}
.reset-text {
    color: white;
    font-size: 14px;
    text-align: center;
    z-index: 1;
}
`