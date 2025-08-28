import styled from "styled-components";

type MenuCategoryProps = {
    category: string;
}

export default function MenuCategory({category}: MenuCategoryProps) {
    return(
        <MyCategory>
            <div className="menu-category">
                <h3 className="category-title">{category}</h3>
            </div>
        </MyCategory>
    )
}

const MyCategory = styled.div`
margin-top: 5px;
margin-bottom: 5px;
position: relative;
text-align: center;
grid-column: 1 / -1;

.menu-category::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, #888, transparent);
}


.category-title {
    font-size: 20px;
    font-weight: 500;
    color: #333;
    padding-bottom: 8px;
    position: relative;
    display: inline-block;
    margin-left: 5px;
    font-family: "Yu Mincho", "MS Mincho", serif; /* より和風なフォント */
    letter-spacing: 1px;
}
`