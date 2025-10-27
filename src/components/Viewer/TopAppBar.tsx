import styled from "styled-components";
import { Product } from "@/data/MenuInfo";

type TopBarProps = {
    currentProduct: Product;
}

export default function TopAppBar({ currentProduct }: TopBarProps) {
    return(
        <MyTopBar>
        {/* Top App Bar */}
        <div className="top-app-bar">
            <button >←</button>
            <h1>{currentProduct.name}（1人前）</h1>
            <button>⋮</button>
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
    }

    .top-app-bar button {
        background: none;
        border: none;
        color: rgba(255,255,255,0.92);
        padding: 8px;
        min-width: 44px;
        min-height: 44px;
        border-radius: 12px;
        font-size: 18px;
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
        font-size: 16px;
        font-weight: 600;
        color: rgba(255,255,255,0.92);
        flex: 1;
        text-align: center;
        margin: 0 12px;
    }
`