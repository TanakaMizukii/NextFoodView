import styled from "styled-components";
import { keyframes } from "styled-components";
import MenuToggle from "./MenuToggle";
import TabNavigation from "./TabNavigation";
import { MyContent } from "./MenuContent";
import { productCategory, productModels } from "../data/MenuInfo";


import React, { useState } from "react";
import { ToggleChangeContext } from "../contexts/ToggleChangeContext";

// 型エイリアスの作成
type MenuContainerProps = {
    className?: string;
};
type MyContainerProps = {
    $expanded: boolean;
}

export default function MenuContainer({ className } : MenuContainerProps) {
    const [toggle, setToggle] = useState(false);

    const toggleConfig = {
        toggleChange: () => setToggle(t => !t)
    }

    const dismissGuide = () => {
        const openPanel = document.getElementById('menu-openGuide')
        if (openPanel) {openPanel.style.display = 'none'};
    };

    const t_update = () => {
        setToggle(t => !t);
        dismissGuide();
    };

    // スワイプ用state
    // numberまたはnullのみを格納できるref
    const touchStartY = React.useRef<number | null>(null);
    const touchEndY = React.useRef<number | null>(null);

    // スワイプ開始
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };
    // スワイプ終了
    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEndY.current = e.changedTouches[0].clientY;
        if (touchStartY.current !== null && touchEndY.current !== null) {
            const diff = touchStartY.current - touchEndY.current;
            if (diff > 50 && !toggle) {
                // 上スワイプで展開
                setToggle(true);
                dismissGuide();
            } else if (diff < -50 && toggle) {
                // 下スワイプで閉じる
                setToggle(false);
            }
        }
        touchStartY.current = null;
        touchEndY.current = null;
    };

    // タブ情報伝達用State
    const [category, setCategory] = useState<string>('メインメニュー');
    const c_update = (elem:string) => setCategory(elem);

    return(
        <div >
            <GuideHint id="menu-openGuide" >
                タップまたは上スワイプ<br/>でメニューを開けます
            </GuideHint>
            <MyContainer id='menu-container' className={className} $expanded={toggle}>
                <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    <MenuToggle onUpdate={t_update} toggle={toggle}/>
                </div>
                <TabNavigation pdtLists={productCategory} onUpdate={c_update}/>
                <ToggleChangeContext.Provider value={toggleConfig}>
                    <MyContent nowCategory={category} models={productModels} />
                </ToggleChangeContext.Provider>
            </MyContainer>
        </div>
    );
}

// 今回はStyled Componentsを使用
export const MyContainer = styled.div<MyContainerProps>`
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(245, 245, 245, 0.95);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    transition: all 0.3s ease-out;
    z-index: 100;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);

    height: ${({ $expanded }) => ($expanded ? '75vh' : '120px')};
    overflow-y: ${({ $expanded }) => ($expanded ? 'auto' : '')};
`;

// --- ガイド: アニメーション ---
const fadeInUp = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const bounce = keyframes`
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-8px);
    }
`;

const GuideHint = styled.div`
    display: none;
    position: fixed;
    bottom: 130px;
    left: 0;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size:20px;
    font-weight: bold;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7); /* 影をつけて視認性確保 */
    animation: ${fadeInUp} 0.5s ease-out forwards;
    z-index: 110;
    pointer-events: none;
    font-family: "Yu Mincho", "MS Mincho", serif; /* より和風なフォント */

    /* 下向きの矢印 */
    &::after {
        content: '↓↓↓';
        font-size: 24px;
        margin-top: 8px;
        transform: rotate(-90deg); /* 文字を回転させて下向きにする */
        animation: ${bounce} 1.5s ease-in-out infinite;
    }
`;