import { useState, useEffect } from "react";
import sliderData from "./sliderData";
import styled from "styled-components";

const Slider = () => {
  const [slider] = useState(sliderData);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // getting last index number from array length - 1,
    // because array index start from 0
    const lastIndex = slider.length - 1;
    // if previous button clicked when at first slide, go to last slide
    // it will look like a continues ribbon
    if (currentIndex < 0) {
      setCurrentIndex(lastIndex);
    }
    // if next button clicked when at last slide, go to first slide
    // again it will look like a continues ribbon
    if (currentIndex > lastIndex) {
      setCurrentIndex(0);
    }
  }, [currentIndex, slider]);

  useEffect(() => {
    // Add +1 to index number with setInterval,
    // so current index number will increase and every slide will pause 6 seconds
    const slider = setInterval(() => {
      setCurrentIndex(currentIndex + 1);
    }, 6000);
    return () => {
      clearInterval(slider);
    };
  }, [currentIndex]);

  return (
    <Wrapper>
      <TimerContainer>
        <circle r="18" cx="20" cy="20"></circle>
      </TimerContainer>
      {/* All slide data comes from an array */}
      {sliderData.map((item, sliderIndex) => {
        const {
          id,
          itemLogoSrc,
          title,
          text,
          itemImgSrc,
          backImgSrc,
          gradient,
        } = item;

        // position is a prop that I send to SlideWrapper so styling can change with it
        let position = "nextSlide";

        if (sliderIndex === currentIndex) {
          position = "activeSlide";
        }
        if (
          sliderIndex === currentIndex - 1 ||
          (currentIndex === 0 && sliderIndex === sliderData.length - 1)
        ) {
          position = "lastSlide";
        }

        return (
          <SlideWrapper
            key={id}
            position={position}
            onClick={() =>
              (currentIndex === 0 && (window.location = "items/6695")) ||
              (currentIndex === 1 && (window.location = "items/6717")) ||
              (currentIndex === 2 && (window.location = "items/6728"))
            }
          >
            <Container gradient={gradient}>
              <ContentWrapper>
                <ItemLogo itemLogoSrc={itemLogoSrc} />
                <Title>{title}</Title>
                <Text>{text}</Text>
              </ContentWrapper>
              <Item itemImgSrc={itemImgSrc} />
            </Container>
            <BackgroundImg backImgSrc={backImgSrc} />
          </SlideWrapper>
        );
      })}
      {/* <Button onClick={() => setIndex(index - 1)}></Button>
      <Button onClick={() => setIndex(index + 1)}></Button> */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 400px;
  max-width: 1440px;
  position: relative;
`;
// const Button = styled.button`
//   width: 100px;
//   height: 30px;
// `;

const SlideWrapper = styled.div`
  width: inherit;
  height: inherit;
  position: absolute;
  transition: all 0.3s linear;
  opacity: ${(props) => (props.position === "activeSlide" ? "1" : "0")};
  transform: ${(props) =>
    (props.position === "activeSlide" && "translateX(0)") ||
    (props.position === "lastSlide" && "translateX(-100)") ||
    (props.position === "nextSlide" && "translateX(100)")};

  &:hover {
    cursor: pointer;
  }
`;

const BackgroundImg = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.backImgSrc});
  opacity: 0.2;
`;

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${(props) => props.gradient};
`;

const ContentWrapper = styled.div`
  position: absolute;
  left: 95px;
  bottom: 60px;
  z-index: 2;
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  font-size: var(--slider-title-font);
  font-family: var(--font-family);
  color: #fff;
  font-weight: 700;
  letter-spacing: -0.05em;
`;

const Text = styled.p`
  font-family: var(--font-family);
  font-weight: 500;
  font-size: var(--slider-content-font);
  color: var(--primary-color);
  letter-spacing: -0.05em;
  width: 850px;
  line-height: 130%;
  margin-top: 17px;
`;

const Item = styled.div`
  background-image: url(${(props) => props.itemImgSrc});
  width: 382px;
  height: 423px;
  position: absolute;
  top: 0;
  z-index: 1;
  right: 86px;
  bottom: -27px;
`;

const ItemLogo = styled.div`
  width: 600px;
  height: 53px;
  background-image: url(${(props) => props.itemLogoSrc});
  background-repeat: no-repeat;
`;

const TimerContainer = styled.svg`
  z-index: 99;
  opacity: 0.5;
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  transform: rotateY(-180deg) rotateZ(-90deg);

  & circle {
    stroke-dasharray: 113px;
    stroke-dashoffset: 0px;
    stroke-linecap: butt;
    stroke-width: 4px;
    stroke: white;
    fill: none;
    animation: countdown 6s linear infinite forwards;

    @keyframes countdown {
      from {
        stroke-dashoffset: 0px;
      }
      to {
        stroke-dashoffset: 113px;
      }
    }
  }
`;

export default Slider;
