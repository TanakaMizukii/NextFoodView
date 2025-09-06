import styled from "styled-components"

export default function ARHelper() {
    return(
        // <!-- AR中のUI -->
        <MyHelper>
            <div id="ar-ui" className="ar-ui">
                <div>AR Mode Active</div>
                <div>商品の選択可能</div>
            </div>

            <button id="exit-button" className="exit-button">AR終了</button>
        </MyHelper>
    )
}

const MyHelper = styled.div`
.ar-ui {
    position: absolute;
    top: 20px;
    left: 20px;
    width: auto;
    color: white;
    background: rgba(0,0,0,0.7);
    padding: 15px;
    border-radius: 10px;
    font-size: 14px;
    display: none;
}

.exit-button {
    position: absolute;
    top: 35px;
    right: 25px;
    background: rgba(244, 67, 54, 0.8);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    display: none;
    z-index: 100;
}
`