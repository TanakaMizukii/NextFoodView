import styled from "styled-components";

import { useRouter } from "next/navigation";

export default function PrimaryFab() {
    const router = useRouter();
    const handleARStart = () => {
        router.push('/arView');
    }

    return(
        <MyTopBar>
            {/* Primary FAB */}
            <button className="primary-fab" onClick={handleARStart}>
                <span className="fab-label">ARを開始</span>
                AR
            </button>
        </MyTopBar>
    )
};

const MyTopBar = styled.div`
    /* Primary FAB */
    .primary-fab {
        position: absolute;
        top: 180px;
        right: 20px;
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
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .primary-fab:active {
        transform: scale(0.95);
    }

    .fab-label {
        position: absolute;
        right: 72px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s;
    }

    .primary-fab:hover .fab-label {
        opacity: 1;
    }
`