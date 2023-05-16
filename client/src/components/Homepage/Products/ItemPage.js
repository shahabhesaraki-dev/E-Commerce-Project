import { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { HomeContext } from "../../Context/HomeContext";
import styled from "styled-components";
import Header from "../../Header";
import Footer from "../../Footer";
import LoadingCircle from "../../LoadingCircle";
import { FaPoop } from "react-icons/fa";

const ItemPage = () => {
  const history = useHistory();
  const { id } = useParams();
  const { allSaleProducts, isSaleLoaded, setCartIconQuantity } =
    useContext(HomeContext);
  const storageCart = JSON.parse(localStorage.getItem("cartItems"));

  const [quantity, setQuantity] = useState(1);
  const [specificProduct, setSpecificProduct] = useState([]);
  const [error, SetError] = useState();

  useEffect(() => {
    const fetchSpecificProduct = async () => {
      const response = await fetch(`/api/get-product/${id}`);
      const result = await response.json();
      setSpecificProduct(result.data);
      result.status !== 200 && SetError(result.message);
    };
    fetchSpecificProduct();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (allSaleProducts)
      allSaleProducts.forEach((saleProduct) => {
        if (specificProduct._id === saleProduct._id) {
          setSpecificProduct(saleProduct);
        }
      });
    // eslint-disable-next-line
  }, [isSaleLoaded, specificProduct]);

  const plusButton = () => {
    if (storageCart) {
      storageCart.forEach((product) => {
        if (product._id === specificProduct._id) {
          if (specificProduct.numInStock - product.selectedItem > quantity) {
            setQuantity(quantity + 1);
          } else {
            setQuantity(quantity);
          }
        } else {
          if (specificProduct.numInStock > quantity) {
            setQuantity(quantity + 1);
          } else {
            setQuantity(quantity);
          }
        }
      });
    } else {
      if (specificProduct.numInStock > quantity) {
        setQuantity(quantity + 1);
      } else {
        setQuantity(quantity);
      }
    }
  };

  const minusButton = () => {
    if (quantity !== 1) {
      setQuantity(quantity - 1);
    } else {
      setQuantity(quantity);
    }
  };

  const addToCartButton = () => {
    setCartIconQuantity((prevState) => (prevState += quantity));
    const cartItemsId = {
      _id: specificProduct._id,
      selectedItem: quantity,
    };
    if (specificProduct.numInStock > 0) {
      if (!storageCart) {
        localStorage.setItem("cartItems", JSON.stringify([cartItemsId]));
      } else {
        const oldData = storageCart;
        const existedProduct = [];

        for (let i = 0; i < oldData.length; i++) {
          if (oldData[i]._id === specificProduct._id) {
            existedProduct.push({
              ...oldData[i],
              selectedItem: oldData[i].selectedItem + quantity,
            });
            oldData.splice(i, 1);
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
    history.push("/cart");
  };

  return (
    <Section>
      <Header />
      {isSaleLoaded ? (
        <>
          {!error ? (
            <Wrapper>
              <ImageSection>
                <ImageItem src={specificProduct.imageSrc} />
              </ImageSection>
              <DetailSection>
                <Title>
                  {specificProduct.length !== 0
                    ? specificProduct.name.split(" ")[0].toUpperCase()
                    : null}
                </Title>
                <Description>{specificProduct.name}</Description>
                <Detail>
                  Category : <Category>{specificProduct.category}</Category>
                </Detail>
                <Detail>
                  Body Location :{" "}
                  <BodyLocation>{specificProduct.body_location}</BodyLocation>
                </Detail>
                {specificProduct.salePrice ? (
                  <SalePriceContainer>
                    <OriginalPrice>{specificProduct.price}</OriginalPrice>
                    <DiscountedPrice>
                      {specificProduct.salePrice}
                    </DiscountedPrice>
                    <Stock>Low stock</Stock>
                  </SalePriceContainer>
                ) : (
                  <PriceContainer>
                    <Price>{specificProduct.price}</Price>
                    {specificProduct.numInStock > 10 ? (
                      <InStock>In Stock</InStock>
                    ) : specificProduct.numInStock > 0 ? (
                      <LowStock>Low Stock</LowStock>
                    ) : (
                      <OutOfStock>OUT OF STOCK</OutOfStock>
                    )}
                  </PriceContainer>
                )}
                <QuantityWrapper>
                  <FirstSquare onClick={minusButton}>-</FirstSquare>
                  <SecondSquare>{quantity}</SecondSquare>
                  <ThirdSquare onClick={plusButton}>+</ThirdSquare>
                </QuantityWrapper>
                <Button
                  onClick={addToCartButton}
                  disabled={specificProduct.numInStock === 0 && true}
                >
                  ADD TO CART
                </Button>
              </DetailSection>
            </Wrapper>
          ) : (
            <Error>
              <ErrorIcon />
              <p>You found a product</p>
              <span>that doesnt exist in our products, good job buddy!</span>
            </Error>
          )}
        </>
      ) : (
        <LoadingContainer>
          <LoadingCircle circleSize={40} />
        </LoadingContainer>
      )}
      <Footer />
    </Section>
  );
};

const Error = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-family);
  font-size: 20px;
  font-weight: 700;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 310px);

  & p {
    font-size: 45px;
    margin-bottom: 15px;
    letter-spacing: -0.05em;
  }

  & span {
    font-size: 15px;
  }
`;

const ErrorIcon = styled(FaPoop)`
  width: 70px;
  height: 70px;
  margin-bottom: 20px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: var(--content-width);
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  margin: 40px 0 80px 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 150px;
  height: calc(100vh - 310px);
`;

const ImageItem = styled.img`
  height: 300px;
`;

const ImageSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 600px;
  height: 600px;
  border: 1px solid var(--border);
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 80px;
  width: calc(100% - 680px);
`;

const Title = styled.h1`
  font-size: 22px;
`;

const Description = styled.span`
  font-family: var(--font-family);
  margin-top: 14px;
  line-height: 125%;
`;

const Detail = styled.span`
  font-family: var(--font-family);
  color: var(--light-grey);
  margin-top: 16px;
  font-size: 14px;
`;

const Category = styled.span`
  font-family: var(--font-family);
  color: var(--primary-color);
`;

const BodyLocation = styled.span`
  font-family: var(--font-family);
  color: var(--primary-color);
`;

const SalePriceContainer = styled.div`
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 40px;
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

const Price = styled.h2`
  font-family: var(--font-family);
  font-weight: 700;
  font-size: 20px;
`;

const OriginalPrice = styled.span`
  font-family: var(--font-family);
  font-weight: 700;
  text-decoration: line-through;
  color: var(--grey);
  font-size: 20px;
`;

const DiscountedPrice = styled.span`
  font-family: var(--font-family);
  font-weight: 700;
  font-size: 20px;
  height: 27px;
  line-height: 23px;
  text-align: center;
  padding: 2px 8px;
  margin-left: 20px;
  color: var(--primary-color);
  background-color: var(--orange);
  border-radius: 5px;
`;

const Stock = styled.span`
  font-family: var(--font-family);
  color: var(--pink);
  font-size: 14px;
  margin-left: 20px;
`;

const QuantityWrapper = styled.div`
  margin: 30px 0 35px 0;
  display: flex;
`;

const FirstSquare = styled.button`
  font-family: var(--font-family);
  width: 30px;
  padding: 4px;
  border: 1px solid var(--border);
  text-align: center;
  background-color: transparent;
  &:hover {
    cursor: pointer;
  }
`;

const SecondSquare = styled.div`
  font-family: var(--font-family);
  width: 30px;
  padding: 7px;
  border: 1px solid var(--border);
  text-align: center;
  border-left: none;
`;

const ThirdSquare = styled.button`
  font-family: var(--font-family);
  width: 30px;
  padding: 4px;
  border: 1px solid var(--border);
  text-align: center;
  background-color: transparent;
  border-left: none;
  &:hover {
    cursor: pointer;
  }
`;

const Button = styled.button`
  height: 45px;
  width: 100%;
  background-color: #fff;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  text-transform: uppercase;
  transition: 0.3 ease;
  font-weight: 700;

  &:hover {
    background-color: var(--primary-color);
    color: #fff;
    cursor: pointer;
  }

  &:disabled {
    opacity: 0;
  }
`;

export default ItemPage;
