import styled from "styled-components";

import { useState } from "react";
import type { Product } from "@/data/MenuInfo";

type BottomProps = {
    currentProduct: Product;
}

export default function BottomSheet({currentProduct}: BottomProps) {
    const [sheetExpanded, setSheetExpanded] = useState(false);

    return(
        <MyTopBar>
            {/* Bottom Sheet */}
            <div className={`bottom-sheet ${sheetExpanded ? 'expanded' : 'peek'}`}>
                <div className="sheet-handle-area" onClick={() => setSheetExpanded(!sheetExpanded)}>
                    <div className="sheet-handle" />
                </div>
                <div className="sheet-content">
                    <h2 className="sheet-title">{currentProduct.name}（1人前）</h2>
                    <div className="sheet-price">¥{currentProduct.price.toLocaleString()}</div>

                    {sheetExpanded && (
                        <>
                            <p className="sheet-description">{currentProduct.description}</p>

                            <div className="sheet-specs">
                                <div className="spec-card">
                                    <div className="spec-label">重量</div>
                                    <div className="spec-value">{currentProduct.weight}</div>
                                </div>
                                <div className="spec-card">
                                    <div className="spec-label">カロリー</div>
                                    <div className="spec-value">{currentProduct.calories}</div>
                                </div>
                                <div className="spec-card">
                                    <div className="spec-label">産地</div>
                                    <div className="spec-value">{currentProduct.origin}</div>
                                </div>
                                <div className="spec-card">
                                    <div className="spec-label">おすすめ</div>
                                    <div className="spec-value">{currentProduct.recommended}</div>
                                </div>
                            </div>

                            <div className="sheet-tags">
                                {currentProduct.tags.map(tag => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {sheetExpanded && (
                    <div className="sheet-footer">
                        <button className="add-to-cart-button"
                        // onClick={handleAddToCart}
                        >
                            カートに追加 - ¥{currentProduct.price.toLocaleString()}
                        </button>
                    </div>
                )}
            </div>
        </MyTopBar>
    )
};

const MyTopBar = styled.div`
    /* Bottom Sheet */
    .bottom-sheet {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(20px);
        border-radius: 24px 24px 0 0;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 110;..........
        max-height: 70vh;
        display: flex;
        flex-direction: column;
    }

    .bottom-sheet.peek {
        transform: translateY(60%);
    }

    .bottom-sheet.expanded {
        transform: translateY(0);
    }

    .sheet-handle-area {
        padding: 12px 0;
        cursor: pointer;
        display: flex;
        justify-content: center;
    }

    .sheet-handle {
        width: 40px;
        height: 4px;
        background: #ddd;
        border-radius: 2px;
    }

    .sheet-content {
        padding: 0 24px 24px;
        overflow-y: auto;
        flex: 1;
    }

    .sheet-title {
        font-size: 20px;
        font-weight: 700;
        color: #1a1a1a;
        margin-bottom: 8px;
    }

    .sheet-price {
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 16px;
    }

    .sheet-description {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
        margin-bottom: 20px;
    }

    .sheet-specs {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom: 20px;
    }

    .spec-card {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 12px;
    }

    .spec-label {
        font-size: 12px;
        color: #999;
        margin-bottom: 4px;
    }

    .spec-value {
        font-size: 15px;
        font-weight: 600;
        color: #333;
    }

    .sheet-tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }

    .tag {
        padding: 6px 12px;
        background: #f0f0f0;
        border-radius: 12px;
        font-size: 12px;
        color: #666;
    }

    .sheet-footer {
        position: sticky;
        bottom: 0;
        background: rgba(255,255,255,0.98);
        padding: 16px 24px;
        border-top: 1px solid #eee;
        margin: 0 -24px -24px;
    }

    .add-to-cart-button {
        width: 100%;
        padding: 16px;
        background: #667eea;
        border: none;
        border-radius: 16px;
        color: white;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        min-height: 56px;
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        transition: all 0.2s;
    }

    .add-to-cart-button:active {
        transform: scale(0.98);
    }
`