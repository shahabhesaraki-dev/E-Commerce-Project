import Header from "./Header";
import Footer from "./Footer";
import styled from "styled-components";
import { TbError404 } from "react-icons/tb";

const NotFound = () => {
  return (
    <Wrapper>
      <Container>
        <Header />
      </Container>
      <Container>
        <NotFoundContainer>
          <Error>
            <ErrorIcon />
            <p>Not this one, eh?</p>
            <span>It happens sometimes, don't take it personally</span>
          </Error>
        </NotFoundContainer>
      </Container>
      <Container>
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

const NotFoundContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 310px);
`;

const Error = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-family);
  font-size: 20px;
  font-weight: 700;
  align-items: center;
  justify-content: center;

  & p {
    font-size: 45px;
    margin-bottom: 15px;
    letter-spacing: -0.05em;
  }

  & span {
    font-size: 15px;
  }
`;

const ErrorIcon = styled(TbError404)`
  width: 170px;
  height: 170px;
  margin-bottom: 20px;
  margin-top: -40px;
`;

export default NotFound;
