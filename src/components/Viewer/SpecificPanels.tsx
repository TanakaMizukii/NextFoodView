import styled from "styled-components";
import { productModels } from "@/data/MenuInfo";

type SpecificProps = {
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function SpecificPanels({currentIndex, setCurrentIndex }: SpecificProps) {
    const handleVariantChange = (index: number) => {
        setCurrentIndex(index);
    };

    return(
        // 名前の変更は未完了
        <MySpecific>
            {/* Specific Panels */}
            <div className="variant-chips">
                <div className="variant-chips-inner">
                    {productModels.map((product, index) => (
                        <button
                            key={product.id}
                            className={`variant-chip ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => handleVariantChange(index)}
                        >
                            {product.shortName}
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
        background: #667eea;
        border-color: transparent;
        color: white;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
`