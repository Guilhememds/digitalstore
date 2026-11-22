import styled from "styled-components";
import Logomenu from "../assets/logo.svg"; 
import Logofooter from "../assets/logo-footer.svg";


const LogoContainer = styled.section`
    margin-left: ${props => props.$isFooter ? "0px" : "15px"};
    background-color: ${props => props.$isFooter ? "transparent" : "#ffffff"};
    display: flex;
    align-items:center;
    justify-content: flex-start;
    max-width: 100%;
    overflow: hidden;

    img {
        max-height: ${props => props.$isFooter ? "50px" : "50px"}; 
        width: 100%;
        height: auto;
        object-fit: contain;
    }

    
    @media (min-width: 768px) {
        img {
            max-height: ${props => props.$isFooter ? "50px" : "50px"};
        }
    }
`;

const Logo = ({ footer = false }) => {
    return (
        <LogoContainer $isFooter={footer}>
            <img src={footer ? Logofooter : Logomenu} 
            alt={footer ? "Digital Store Footer Logo": "Digital Store Logo"}
            />
        </LogoContainer>
    );
};

export default Logo;