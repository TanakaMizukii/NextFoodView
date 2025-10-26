import styled from "styled-components";

import { useState, useRef } from "react";
import { categories } from "@/data/MenuInfo";

export interface Category {
    id: number;
    name: string;
    icon: string;
    count: number;
    description: string;
}

export type CategoryState = 'center' | 'adjacent' | 'far';

export interface CategoryStates {
    [index: number]: CategoryState;
}

export default function CategoryCarousel() {
    const [categoryStates, setCategoryStates] = useState<CategoryStates>({ 0: 'center' });
    const categoryScrollRef = useRef(null);
    // 駆動部分は後で記述の必要あり

    return(
        <MyCategory>
            {/* Category Carousel */}
            <div className="category-carousel">
                <div className="category-scroll" ref={categoryScrollRef}>
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className={`category-item ${categoryStates[index] || 'far'}`}
                            onClick={() => {
                                // scrollToCategory(index);
                                // showSnackbar(`${category.name}カテゴリーを選択`, category.icon);
                            }}
                        >
                            <div className="category-card">
                                {/* <div className="category-icon">{category.icon}</div> */}
                                <div className="category-name">{category.name}</div>
                                {/* <div className="category-count">{category.count}品</div> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MyCategory>
    )
};

const MyCategory = styled.div`
    /* Category Carousel */
    .category-carousel {
        position: relative;
        padding: 16px 0;
        overflow: hidden;
    }

    .category-carousel::before,
    .category-carousel::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 80px;
        pointer-events: none;
        z-index: 10;
    }

    .category-carousel::before {
        left: 0;
        background: linear-gradient(90deg, #1a1a1a 0%, transparent 100%);
    }

    .category-carousel::after {
        right: 0;
        background: linear-gradient(270deg, #1a1a1a 0%, transparent 100%);
    }

    .category-scroll {
        display: flex;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        gap: 16px;
        padding: 0 calc(50vw - 120px);
    }

    .category-scroll::-webkit-scrollbar {
        display: none;
    }

    .category-item {
        flex-shrink: 0;
        width: 240px;
        scroll-snap-align: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .category-card {
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 16px;
        padding: 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform: scale(0.85);
        opacity: 0.5;
        height: 100%;
    }

    .category-item.center .category-card {
        background: rgba(255,255,255,0.92);
        border-color: transparent;
        box-shadow: 0 8px 24px rgba(255,255,255,0.3);
        transform: scale(1);
        opacity: 1;
    }

    .category-item.adjacent .category-card {
        transform: scale(0.9);
        opacity: 0.7;
    }

    .category-icon {
        font-size: 32px;
        margin-bottom: 8px;
        transition: all 0.3s;
    }

    .category-item.center .category-icon {
        font-size: 40px;
    }

    .category-name {
        font-size: 16px;
        font-weight: 600;
        color: rgba(255,255,255,0.8);
        margin-bottom: 4px;
        transition: all 0.3s;
    }

    .category-item.center .category-name {
        color: #1a1a1a;
        font-size: 18px;
        font-weight: 700;
    }

    .category-count {
        font-size: 12px;
        color: rgba(255,255,255,0.5);
        transition: all 0.3s;
    }

    .category-item.center .category-count {
        color: #666;
    }
`