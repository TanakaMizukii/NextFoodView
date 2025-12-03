'use client';

import styled, { keyframes } from 'styled-components';

type ARResetPanelProps = {
    onRestart: () => void;
};

export default function ARResetPanel({ onRestart }: ARResetPanelProps) {
    return (
        <ResetPanelWrapper id='reset-overlay'>
            <div className="reset-content">
                <div className="reset-icon" onClick={onRestart}></div>
                <p className="reset-message-main">
                    平面の認識をリセットしました
                </p>
                <p className="reset-message-sub">
                    下のボタンから<br />もう一度平面認識を開始できます。
                </p>
                <RestartButton onClick={onRestart}>
                    平面認識を再実行
                </RestartButton>
            </div>
        </ResetPanelWrapper>
    );
}

const pulse = keyframes`
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
    }
    70% {
        transform: scale(1.05);
        box-shadow: 0 0 10px 20px rgba(255, 255, 255, 0);
    }
    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
`;

const ResetPanelWrapper = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    color: white;
    text-align: center;
    user-select: none;
    -webkit-user-select: none;

    .reset-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        padding: 20px;
    }

    .reset-icon {
        width: 80px;
        height: 80px;
        border: 3px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        position: relative;
        margin-bottom: 10px;
        animation: ${pulse} 2.5s ease-in-out infinite;

        &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 40px;
            height: 40px;
            transform: translate(-50%, -50%);
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>') no-repeat center;
            background-size: contain;
        }
    }

    .reset-message-main {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 0.02em;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        margin: 0;
    }

    .reset-message-sub {
        font-size: 16px;
        opacity: 0.9;
        line-height: 1.5;
        margin: -10px 0 0;
    }
`;

const RestartButton = styled.button`
    padding: 14px 28px;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    background-color: #ffffff;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    margin-top: 10px;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
`;