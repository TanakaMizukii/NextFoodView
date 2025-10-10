import styled from "styled-components";
import { useState } from "react";

type categoryProps = {
    pdtLists: string[];
    onUpdate: (elem: string) => void;
    toggleCheck: () => void;
};

export default function TabNavigation({pdtLists, onUpdate, toggleCheck} : categoryProps) {
    const [tab, setTab] = useState(0);
    const handleClick = (elem:string) => {
        onUpdate(elem);
        toggleCheck();
    }
    return(
        <MyTab>
            <div className="tab-navigation">
                {
                pdtLists.map((elem, index) => (
                    <button key={index}
                            className={`tab-btn ${index === tab ? 'active': ''}`}
                            onClick={() => {setTab(index); handleClick(elem);}}
                    >
                        {elem}
                    </button>
                ))
                }
            </div>
        </MyTab>
    )
};

const MyTab = styled.div`
    .tab-navigation {
        display: flex;
        justify-content: flex-start;
        padding: 10px 15px;
        overflow-x: auto;
        white-space: nowrap;
        background-color: #f5f5f5;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none; /* Firefox */
        /* 追加: 固定表示 */
        position: sticky;
        top: 50px; /* menu-toggleの高さに合わせて調整 */
        z-index: 9;
        cursor: grab; /* カーソルをつかめる形状に */
    }
    .tab-navigation:active {
        cursor: grabbing; /* ドラッグ中のカーソル */
    }

    /* Chrome、Safari、Edgeのスクロールバーを非表示 */
    .tab-navigation::-webkit-scrollbar {
        display: none;
    }

    .tab-btn {
        padding: 8px 20px;
        margin-right: 10px;
        background-color: #fff;
        border: none;
        border-radius: 20px;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        white-space: nowrap;
        flex-shrink: 0;
    }
    .tab-btn.active {
        background-color: #333;
        color: #fff;
    }
`