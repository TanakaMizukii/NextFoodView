import styled from "styled-components";

type MenuToggleProps = {
    onUpdate: () => void;
    toggle: boolean;
};

export default function MenuToggle({onUpdate, toggle}: MenuToggleProps) {
    const handleClick = () => onUpdate();

    return(
        <MyPanel >
            <div id="menuToggle" className="menu-toggle" onClick={handleClick}>
                <span id="toggleText">{toggle ? 'メニューを閉じる':'メニューを開く'}</span>
            </div>
        </MyPanel>
    )
}

const MyPanel = styled.div`
.menu-toggle {
    width: 100%;
    text-align: center;
    padding: 15px 0;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
    position: relative;
    background-color: rgba(245, 245, 245, 0.95); /* 背景色を追加して内容が透けないように */
    /* 追加: 固定表示 */
    position: sticky;
    top: 0;
    z-index: 10;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}

.menu-toggle:after {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 4px;
    background-color: #e0e0e0;
    border-radius: 2px;
}
`