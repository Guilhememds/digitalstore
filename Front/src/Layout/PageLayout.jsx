import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styled from "styled-components";

const Background = styled.section`
    background-color: #F8F8F8;
`

const PageLayout = () => {
  return (
    <Background>
      <Header />
      <Outlet />
      <Footer />
    </Background>
  );
};

export default PageLayout;
