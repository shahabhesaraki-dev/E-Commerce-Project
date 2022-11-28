import Header from "../Header";
import Slider from "./Slider/";
import Products from "./Products/";
import Footer from "../Footer";
import styled from "styled-components";

const Homepage = () => {
  return (
    <Wrapper>
      <Container>
        <Header />
      </Container>
      <Slider />
      <Container>
        <Products />
        <Footer />
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Container = styled.div`
  width: var(--content-width);
`;

export default Homepage;
