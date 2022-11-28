import styled, { keyframes } from "styled-components";
import { CgSpinner } from "react-icons/cg";

const LoadingCircle = ({ circleSize }) => {
  return (
    <Wrapper>
      <StyledLoadingCircle size={circleSize} />
    </Wrapper>
  );
};

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const StyledLoadingCircle = styled(CgSpinner)`
  margin: 0 auto;
  animation: ${spin} 2s infinite linear;
`;

export default LoadingCircle;
