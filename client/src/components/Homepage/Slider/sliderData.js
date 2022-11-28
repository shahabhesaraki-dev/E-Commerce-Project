import fenix2 from "../../../assets/fenix2.png";
import forerunner620 from "../../../assets/forerunner620.png";
import virb from "../../../assets/camera.png";
import sliderBack1 from "../../../assets/slider-back1.png";
import sliderBack2 from "../../../assets/slider-back2.png";
import sliderBack3 from "../../../assets/slider-back3.png";
import garminLogo1 from "../../../assets/Garmin-logo1.png";
import garminLogo2 from "../../../assets/Garmin-logo2.png";
import garminLogo3 from "../../../assets/Garmin-logo3.png";

const sliderData = [
  {
    id: 1,
    itemLogoSrc: garminLogo1,
    title: "navigate your journey",
    text: "fēnix 2 provides comprehensive navigation and tracking functionalities as well as trip information to guide you on and off the beaten track.",
    itemImgSrc: fenix2,
    backImgSrc: sliderBack1,
    gradient: "linear-gradient(291.45deg, #f83b7f -3.37%, #faaf1e 114.15%);",
  },
  {
    id: 2,
    itemLogoSrc: garminLogo2,
    title: "it knows your potential",
    text: "Forerunner 620 can estimate your VO2 max, your body’s maximal oxygen consumption. Knowing your VO2 max is a great way to measure your physical fitness and improve your performance.",
    itemImgSrc: forerunner620,
    backImgSrc: sliderBack2,
    gradient:
      "linear-gradient(291.45deg, rgba(0, 255, 209, 0.2) -3.37%, #3BB4F8 114.15%);",
  },
  {
    id: 3,
    itemLogoSrc: garminLogo3,
    title: "sleek and easy-to-use",
    text: "VIRB Elite was engineered for easy operation with a large, instant record slider switch on the side of the camera. The slide and click of the switch makes it easy to know that you are recording, even if you’re wearing gloves.",
    itemImgSrc: virb,
    backImgSrc: sliderBack3,
    gradient:
      "linear-gradient(293.03deg, rgba(165, 0, 0, 0.84) -15.21%, rgba(250, 0, 255, 0.21) 117.77%);",
  },
];

export default sliderData;
