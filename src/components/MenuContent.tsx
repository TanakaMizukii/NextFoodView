import styled from "styled-components";
import MenuCategory from "./MenuCategory";
import MenuItem from "./MenuItem";
import type { ProductModelsProps } from "../data/MenuInfo";
import React from "react";

type MenuContentProps = {
    className?: string;
    nowCategory: string;
    models: ProductModelsProps;
}

export default function MenuContent({className, nowCategory, models}: MenuContentProps) {
    const selectCategory: {[index: string] : string[]}  = {
        'メインメニュー': ['盛り合わせ', 'カルビ', 'タン', 'ホルモン', '締めの一品',],
        '盛り合わせ': ['盛り合わせ'],
        'カルビ': ['カルビ'],
        'ホルモン': ['ホルモン'],
        '締めの一品': ['締めの一品'],
        // 'その他': ['その他'],
    }    // まず配列を取り出しておく
    const categories = selectCategory[nowCategory] ?? [];
    return(
        <div className={className}>
            {categories.map((cat) => (
                // それぞれのmapにキーを付けて配置
                <React.Fragment key={cat}>
                    <MenuCategory category={cat} />
                    {models.filter(m => m.category === cat)
                        .map((model, idx) => (
                            <MenuItem key={model.name ?? idx} model={model} />
                        ))
                    }
                </React.Fragment>
            ))}
        </div>
    )
}

export const MyContent = styled(MenuContent)`
    padding: 5px 15px 15px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    height: 82vh;
    overflow-y: auto; /* コンテンツ部分のスクロールを可能に */
`