import styled from "styled-components";

import React from "react";
import { useContext } from 'react';
import { ModelChangeContext } from "../../contexts/ModelChangeContext";
import { categories, productModels } from "@/data/MenuInfo";
import type { ProductModel } from "@/data/MenuInfo";

type SpecificProps = {
    currentIndex: number;
    currentCategory: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function SpecificPanels({currentIndex, currentCategory, setCurrentIndex }: SpecificProps) {
    const selectCategory: {[index: string] : string[]}  = {
        'メインメニュー': ['盛り合わせ', 'カルビ', 'タン', 'ホルモン', '締めの一品'],
        '盛り合わせ': ['盛り合わせ'],
        'カルビ': ['カルビ'],
        'ホルモン': ['ホルモン'],
        '締めの一品': ['締めの一品'],
        // 'その他': ['その他'],
    }
    // まず今回配置する配列を取り出しておく
    const nowCategory = categories[currentCategory].name;
    const viewCategories = selectCategory[nowCategory] ?? [];

    const currentProduct: ProductModel = productModels[currentIndex]

    const { changeModel } = useContext(ModelChangeContext);
    const handleVariantChange = (index: number, model: ProductModel) => {
        setCurrentIndex(index);
        changeModel({modelName: model.name, modelPath: model.model, modelDetail: model.description, modelPrice: model.price});
        console.log(viewCategories);
    };

    const variants = productModels.map((m, i) => ({model: m, i}))
        .filter(({ model }) => viewCategories.includes(model.category));

    return(
        // 名前の変更は未完了
        <MySpecific>
            {/* Specific Panels */}
            <div className="variant-chips">
                <div className="variant-chips-inner">
                    {variants.map(({ model, i }) => (
                        // それぞれのmapにキーを付けて配置
                        <button
                            key={model.id}
                            className={`variant-chip ${model === currentProduct ? 'active' : ''}`}
                            onClick={() => handleVariantChange(i, model)}
                        >
                            {model.shortName} ¥{model.minPrice.toLocaleString()}
                        </button>
                    ))}
                </div>
            </div>
        </MySpecific>
    )
};

const MySpecific = styled.div`
    /* Specific Panels */
    .variant-chips {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 50px;
        padding: 12px 16px;
        display: flex;
        gap: 8px;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .variant-chips::-webkit-scrollbar {
        display: none;
    }

    .variant-chips-inner {
        display: inline-flex;
        gap: 8px;
        padding: 4px 0;
    }

    .variant-chip {
        padding: 10px 20px;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 20px;
        color: rgba(255,255,255,1);
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
        min-height: 44px;
        display: inline-flex;
        align-items: center;
    }

    .variant-chip.active {
        background: #ff4d4d;
        border-color: transparent;
        color: white;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(255, 80, 80, 0.45);
    }
`