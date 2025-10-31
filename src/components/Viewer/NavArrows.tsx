import styled from "styled-components";

import { useContext } from 'react';
import { ModelChangeContext } from "../../contexts/ModelChangeContext";
import productModels from "@/data/MenuInfo";

type ArrowsProps = {
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function NavArrows({currentIndex, setCurrentIndex}: ArrowsProps) {
    const { changeModel } = useContext(ModelChangeContext);
    const handleItemBackChange = (index: number) => {
        if (currentIndex > 0) {
            setCurrentIndex(index);
            const model = productModels[index]
            changeModel({modelName: model.name, modelPath: model.model, modelDetail: model.description, modelPrice: model.price})
        }
    };
    const handleItemGoChange = (index: number) => {
        if (productModels.length - 1) {
            setCurrentIndex(index);
            const model = productModels[index]
            changeModel({modelName: model.name, modelPath: model.model, modelDetail: model.description, modelPrice: model.price})
        }
    };

    return(
        <MyNavArrows>
            {/* Navigation Arrows */}
            <div className="nav-arrows">
                <button
                    className="nav-arrow"
                    onClick={() => {
                        handleItemBackChange(currentIndex - 1);
                    }}
                    disabled={currentIndex === 0}
                >
                    ◀
                </button>
                <button
                    className="nav-arrow"
                    onClick={() =>
                        handleItemGoChange(currentIndex + 1)}
                    disabled={currentIndex === productModels.length - 1}
                >
                    ▶
                </button>
            </div>
        </MyNavArrows>
    )
};

const MyNavArrows = styled.div`
        /* Navigation Arrows */
        .nav-arrows {
            position: absolute;
            bottom: calc(env(safe-area-inset-bottom) + 150px);
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-between;
            padding: 0 12px;
            pointer-events: none;
            z-index: 85;
        }

        .nav-arrow {
            width: 40px;
            height: 40px;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 50%;
            color: rgba(255,255,255,0.8);
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: all;
            cursor: pointer;
            transition: all 0.2s;
        }

        .nav-arrow:active {
            background: rgba(0,0,0,0.7);
            transform: scale(0.95);
        }

        .nav-arrow:disabled {
            opacity: 0.2;
            cursor: not-allowed;
        }
`