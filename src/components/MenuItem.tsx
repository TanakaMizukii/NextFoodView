import styled from "styled-components";
import Image from "next/image";
import { useContext } from 'react';
import { ModelChangeContext } from "../contexts/ModelChangeContext";
import { ToggleChangeContext } from "../contexts/ToggleChangeContext";

export type modelProps = {
    name: string;
    image: string;
    model: string;
    minDetail?: string;
    description: string;
    category: string;
    price: string;
};

type modelItemProps = {
    model: modelProps;
    onClick?: (model: modelItemProps['model']) => void;
};

export default function MenuItem({model}: modelItemProps) {
    const { changeModel } = useContext(ModelChangeContext);
    const { toggleChange } = useContext(ToggleChangeContext);

    const handleItemClick = () => {
        if (typeof changeModel === 'function') {
            changeModel({ modelPath: model.model, modelDetail: model.description });
        } else {
            console.error('changeModel is not a function!', changeModel);
        }
        if (typeof toggleChange === 'function') {
            toggleChange();
        }
    };

    return(
        <MyItem >
            <div className="menu-item load-item-panel" onClick={handleItemClick}>
                <img src={model.image} alt={model.name} className="menu-item-image" />
                <div className="menu-item-info">
                    <div className="menu-item-title">{model.name}</div>
                    <div className="menu-item-price">{model.price}円</div>
                    <button className="view-item-btn">商品を表示</button>
                </div>
            </div>
        </MyItem>
    )
}

const MyItem = styled.div`
.menu-item {
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.menu-item-image {
    width: 100%;
    height: 120px;
    background-color: #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    object-fit: cover; /* 追加：画像を適切に表示 */
}

.menu-item-info {
    padding: 10px;
}

.menu-item-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 3px;
}

.menu-item-description {
    font-size: 12px;
    color: #666;
    margin-bottom: 5px;
}

.menu-item-price {
    font-size: 14px;
    font-weight: bold;
}

.view-item-btn {
    background-color: #f5f5f5;
    border: none;
    width: 100%;
    padding: 8px;
    margin-top: 8px;
    border-radius: 5px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.view-item-btn:hover {
    background-color: #e0e0e0;
}
`