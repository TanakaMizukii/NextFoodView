import styled from "styled-components";
import { useRouter } from "next/navigation";
import { MyContent } from "../MenuContent";
import productModels from "@/data/MenuInfo";

type TopAppBarProps = {
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
};

export default function TopAppBar({ menuOpen, setMenuOpen }: TopAppBarProps) {
    const router = useRouter();

    return(
        <MyTopBar>
            {/* Top App Bar */}
            <div className="top-app-bar">
                <button onClick={() => router.back()}>←</button>
                <h1>ホルモン屋海州</h1>
                <button onClick={() => setMenuOpen(!menuOpen)}>⋮</button>
            </div>

            {/* Overlay */}
            {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}

            {/* Side Slide Bar */}
            <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
                <MyContent nowCategory="メインメニュー" models={productModels} />
            </div>
        </MyTopBar>
    )
};

const MyTopBar = styled.div`
    /* Top App Bar */
    .top-app-bar {
        display: flex;
        position: relative;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: rgba(0,0,0,0.1);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        min-height: 56px;
        max-height: 40px;
        z-index: 30; /* Ensure it's above the side menu */
    }

    .top-app-bar button {
        background: none;
        border: none;
        color: rgba(255,255,255,0.92);
        padding: 8px;
        min-width: 44px;
        min-height: 44px;
        border-radius: 12px;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .top-app-bar button:active {
        background: rgba(255,255,255,0.1);
    }

    .top-app-bar h1 {
        font-size: 18px;
        font-weight: 600;
        color: rgba(255,255,255,0.92);
        flex: 1;
        text-align: center;
        margin: 0 12px;
    }

    /* Side Menu Overlay */
    .menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 19; /* Below side-menu, above everything else */
    }

    /* Side Menu */
    .side-menu {
        position: fixed;
        top: 0;
        right: 0;
        width: 80%;
        height: 100%;
        background: rgba(255,255,255,0.92);
        backdrop-filter: blur(10px);
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        z-index: 20; /* Ensure it's above other top layers */
        padding-top: 60px; /* Add padding to avoid being obscured by top-app-bar */
    }

    .side-menu.open {
        transform: translateX(0);
    }
`