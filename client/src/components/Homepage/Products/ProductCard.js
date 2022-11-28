import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import cartIcon from "../../../assets/cart.svg";
import viewIcon from "../../../assets/search.svg";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { HomeContext } from "../../Context/HomeContext";

const ProductCard = ({ productData }) => {
  const { cartIconQuantity, setCartIconQuantity } = useContext(HomeContext);

  const history = useHistory();
  const { category, imageSrc, name, numInStock, price, _id, salePrice } =
    productData;

  const [isProductAdded, setIsProductAdded] = useState(false);

  const createDescription = (str) => {
    const indexOfSpace = str.indexOf(" ");

    if (indexOfSpace === -1) {
      return "";
    } else {
      return str.substring(indexOfSpace + 1, 84);
    }
  };

  const addToCart = () => {
    cartIconQuantity && setCartIconQuantity((prevState) => (prevState += 1));
    setIsProductAdded(true);
    const storageCart = localStorage.getItem("cartItems");

    const cartItemsId = {
      _id,
      selectedItem: 1,
    };
    if (numInStock > 0) {
      if (!storageCart) {
        localStorage.setItem("cartItems", JSON.stringify([cartItemsId]));
      } else {
        const oldData = JSON.parse(storageCart);
        const existedProduct = [];

        for (let i = 0; i < oldData.length; i++) {
          if (oldData[i]._id === _id) {
            if (numInStock > oldData[i].selectedItem) {
              existedProduct.push({
                ...oldData[i],
                selectedItem: oldData[i].selectedItem + 1,
              });
              oldData.splice(i, 1);
            } else {
              return null;
            }
          }
        }

        if (existedProduct.length === 0) {
          oldData.push(cartItemsId);
          localStorage.setItem("cartItems", JSON.stringify(oldData));
        } else {
          oldData.push(existedProduct[0]);
          localStorage.setItem("cartItems", JSON.stringify(oldData));
        }
      }
    }
    setTimeout(() => {
      setIsProductAdded(false);
    }, 2000);
  };

  const goToItemPage = () => {
    history.push(`/items/${_id}`);
  };

  return (
    <Wrapper>
      <MessageWrapper
        isProductAdded={isProductAdded}
        setIsProductAdded={setIsProductAdded}
      >
        <Icon />
        <Message>Added to cart</Message>
      </MessageWrapper>
      <Overlay>
        <ButtonWrapper>
          {numInStock > 0 && (
            <CartButton onClick={addToCart}>
              <OverlayIcon src={cartIcon}></OverlayIcon>
            </CartButton>
          )}
          <SearchButton onClick={goToItemPage}>
            <OverlayIcon src={viewIcon}></OverlayIcon>
          </SearchButton>
        </ButtonWrapper>
      </Overlay>

      <ProductCardWrapper>
        <UpperContainer>
          <ImageWrapper>
            <ItemImage src={imageSrc}></ItemImage>
          </ImageWrapper>
          <ItemName>{name.split(" ")[0].toUpperCase()}</ItemName>
          <ItemDescription>
            {createDescription(name)}
            {createDescription(name).length > 80 && " ..."}
          </ItemDescription>
        </UpperContainer>
        <LowerContainer>
          <Category>{category}</Category>
          <Line />
          {!salePrice ? (
            <PriceWrapper>
              <Price>{price}</Price>
              {numInStock > 10 ? (
                <InStock>In Stock</InStock>
              ) : numInStock > 0 ? (
                <LowStock>Low Stock</LowStock>
              ) : (
                <OutOfStock>OUT OF STOCK</OutOfStock>
              )}
            </PriceWrapper>
          ) : (
            <OnSaleWrapper>
              <OldPrice>{price}</OldPrice>
              <NewPrice>{salePrice}</NewPrice>
              <LowStock>Low Stock</LowStock>
            </OnSaleWrapper>
          )}
        </LowerContainer>
      </ProductCardWrapper>
    </Wrapper>
  );
};

const slide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(300px);
  }
  5% {
    opacity: 1;
    transform: translateX(0px);
  }
  90%{
    opacity: 1;
    transform: translateX(0px);
  }
  100%{
    opacity: 1;
    transform: translateX(300px);
  }
`;

const Icon = styled(AiOutlineCheckCircle)`
  width: 16px;
  height: 16px;
  margin-right: 7px;
  color: #fff;
`;

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  z-index: 2;
  position: absolute;
  top: 20px;
  right: 0;
  background-color: var(--green);
  opacity: 0;
  padding: 5px 10px;
  border-radius: 10px 0 0 10px;
  animation: ${(props) =>
    props.isProductAdded &&
    css`
      ${slide} 3s linear
    `};
`;

const Message = styled.span`
  font-family: var(--font-family);
  font-size: 12px;
  font-weight: 400;
  color: #fff;
`;

const OverlayIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const UpperContainer = styled.div``;

const LowerContainer = styled.div``;

const Line = styled.div`
  width: 100%;
  border-bottom: 1px solid var(--lightest-grey);
  margin: 18px 0;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CartButton = styled.button`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: none;
  margin: 8px;
  transition: 0.2s ease;
  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`;

const SearchButton = styled.button`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: none;
  margin: 8px;
  transition: 0.2s ease;
  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 180px;
`;

const Overlay = styled.span`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--hover-black);
  opacity: 0;
  z-index: 1;
  border-radius: 7px;
  transition: 0.3s ease;
`;

const Wrapper = styled.div`
  position: relative;
  width: 288px;
  height: 440px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  &:hover ${Overlay} {
    opacity: 1;
  }
`;

const Category = styled.h2`
  font-family: var(--font-family);
  font-weight: 400;
  color: var(--light-grey);
  margin-top: 20px;
`;

const LowStock = styled.h3`
  font-family: var(--font-family);
  font-weight: 400;
  color: var(--pink);
  margin-left: 10px;
`;

const InStock = styled.h3`
  font-family: var(--font-family);
  font-weight: 400;
  color: var(--green);
  margin-left: 10px;
`;

const OutOfStock = styled.h3`
  font-family: var(--font-family);
  font-weight: 400;
  margin-left: 10px;
`;

const Price = styled.h1`
  font-family: var(--font-family);
  font-weight: 700;
`;

const OldPrice = styled.h3`
  font-size: 12px;
  font-weight: 700;
  text-decoration-line: line-through;
  color: var(--grey);
  margin-right: 10px;
`;
const NewPrice = styled.h2`
  font-family: var(--font-family);
  font-weight: 700;
  height: 27px;
  line-height: 8px;
  text-align: center;
  padding: 10px;

  color: #4b4b4b;
  background: rgba(255, 183, 74, 0.55);
  border-radius: 5px;
`;
const ItemDescription = styled.h2`
  width: 228px;
  /* height: 60px; */
  font-family: var(--font-family);
  font-weight: 400;
  line-height: 125%;
  margin-top: 10px;
`;
const ItemName = styled.h1`
  font-family: var(--font-family);
  font-weight: 700;
  margin-top: 20px;
`;

const ItemImage = styled.img``;

const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const ProductCardWrapper = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  border: 1px solid var(--lightest-grey);
  /* box-shadow: 0px 8px 17px -3px rgba(24, 39, 75, 0.07); */
  border-radius: 7px;
  background-color: #fff;
`;
const OnSaleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export default ProductCard;
