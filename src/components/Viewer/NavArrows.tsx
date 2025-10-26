import styled from "styled-components";

export default function NavArrows() {
    return(
        <MyNavArrows>
            {/* Navigation Arrows */}
            <div className="nav-arrows">
                <button
                    className="nav-arrow"
                    // onClick={() => currentIndex > 0 && handleVariantChange(currentIndex - 1)}
                    // disabled={currentIndex === 0}
                >
                    ◀
                </button>
                <button
                    className="nav-arrow"
                    // onClick={() => currentIndex < products.length - 1 && handleVariantChange(currentIndex + 1)}
                    // disabled={currentIndex === products.length - 1}
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