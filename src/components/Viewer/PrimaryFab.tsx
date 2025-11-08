import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PrimaryFab() {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleARStart = () => {
        router.push('/arJS');
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
                <button className="ar-start-button" onClick={handleARStart}>ARを開始</button>
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
        background: #667eea;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .ar-start-button:hover {
        background: #5a6ed0;
    }

    /* Primary FAB */
    .primary-fab {
        width: 64px;
        height: 64px;
        background: #667eea;
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 24px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        /* Ensure FAB is on top of its own content initially */
        position: relative;
        flex-shrink: 0; /* Prevent FAB from shrinking */
    }

    .primary-fab:active {
        transform: scale(0.95);
    }
`