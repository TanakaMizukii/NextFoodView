import styled from "styled-components";
import { MyContent } from "../MenuContent";
import productModels from "@/data/MenuInfo";

type TopAppBarProps = {
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
};

export default function SideSlidePanel({ menuOpen, setMenuOpen }: TopAppBarProps) {
    return(
        <MySideSlide>
            {/* Overlay */}
            {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}

            {/* Side Slide Bar */}
            <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
                <MyContent nowCategory="メインメニュー" models={productModels} viewer={true} />
            </div>
        </MySideSlide>
    )
};

const MySideSlide = styled.div`
    /* Side Menu Overlay */
    .menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 100; /* Below side-menu, above everything else */
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
        z-index: 101; /* Ensure it's above other top layers */
        padding-top: 15px; /* Add padding to avoid being obscured by top-app-bar */
    }

    .side-menu.open {
        transform: translateX(0);
    }
`