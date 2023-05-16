import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import { HomeContext } from "../Context/HomeContext";
import styled from "styled-components";
import { RiDeleteBinLine } from "react-icons/ri";
import LoadingCircle from "../LoadingCircle";

const CartPage = () => {
  const history = useHistory();
  const cartItems = JSON.parse(localStorage.getItem("cartItems"));
  const {
    allSaleProducts,
    isSaleLoaded,
    setCartIconQuantity,
    cartIconQuantity,
  } = useContext(HomeContext);
  const [quality, setQuality] = useState([]);
  const [allItemsAmount, setAllItemsAmount] = useState();
  const [productsInCart, setProductInCart] = useState([]);
  const [findSaleProduct, setFindSaleProduct] = useState([]);
  const [itemAmount, setItemAmount] = useState([]);
  const [mergedItems, setMergedItems] = useState();
  const [sumAll, setSumAll] = useState();

  const handleCheckout = () => {
    localStorage.setItem("confirmedBuy", JSON.stringify(cartItems));
    fetch("/api/update-stock", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: cartItems,
      }),
    })
      .then((result) => {
        return result.json();
      })
      .then((response) => {
        if (response.status === 200) {
          history.push("/confirmation", {
            productInCart: productsInCart,
            totalPrice: sumAll,
          });
          window.localStorage.removeItem("cartItems");
          setCartIconQuantity(1);
        } else {
          console.log("ERROR");
        }
      });
  };

  useEffect(() => {
    if (cartItems) {
      const allAmountArray = [];
      quality.forEach((item) => {
        allAmountArray.push(item.selectedItem);
      });

      const sum = allAmountArray.reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);

      setAllItemsAmount(sum);
      setQuality(cartItems);
    }
    // eslint-disable-next-line
  }, [allItemsAmount]);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const uniqueValues = [...new Set(cartItems.map((item) => item._id))];
      fetch("/api/get-products-from-ids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productIds: uniqueValues,
        }),
      })
        .then((result) => {
          return result.json();
        })
        .then((products) => {
          setProductInCart(products.data);
        });
    }
    // eslint-disable-next-line
  }, [quality]);

  const handleDelete = (id) => {
    cartItems.splice(
      cartItems.findIndex((item) => item._id === id),
      1
    );
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    setQuality(cartItems);
    setAllItemsAmount(cartItems.length);
    setCartIconQuantity(allItemsAmount);
    window.location.reload();
  };

  useEffect(() => {
    const mergedArray =
      productsInCart &&
      productsInCart.map((item) => {
        const otherArray =
          allSaleProducts &&
          allSaleProducts.find((otherItem) => otherItem._id === item._id);
        return { ...item, ...otherArray };
      });

    mergedArray && setFindSaleProduct(mergedArray);
  }, [quality, allSaleProducts, productsInCart]);

  useEffect(() => {
    const itemAmountArray = [];
    findSaleProduct &&
      findSaleProduct.forEach((product) => {
        if (product.salePrice) {
          itemAmountArray.push({
            _id: product._id,
            price: Number(product.salePrice.replace(/["$,]/g, "")),
          });
        } else {
          itemAmountArray.push({
            _id: product._id,
            price: Number(product.price.replace(/["$,]/g, "")),
          });
        }
      });
    setItemAmount(itemAmountArray);
  }, [
    quality,
    allSaleProducts,
    productsInCart,
    allItemsAmount,
    findSaleProduct,
  ]);

  useEffect(() => {
    const mergedArray = quality.map((item) => {
      const otherArray = itemAmount.find(
        (otherItem) => otherItem._id === item._id
      );
      return { ...item, ...otherArray };
    });

    setMergedItems(mergedArray);
  }, [itemAmount, findSaleProduct, quality]);

  useEffect(() => {
    if (mergedItems) {
      const sumArray = [];
      mergedItems.forEach((item) => {
        sumArray.push(item.price * item.selectedItem);
      });

      const sum = sumArray.reduce((partialSum, a) => partialSum + a, 0);

      setSumAll(sum.toFixed(2));
    }
  }, [itemAmount, mergedItems, quality]);

  return (
    <Section>
      <Header />
      {cartItems && cartItems.length > 0 ? (
        sumAll && productsInCart.length > 0 ? (
          <Wrapper>
            <ProductsContainer>
              {productsInCart &&
                productsInCart.length > 0 &&
                productsInCart.map((product, index) => {
                  // Check if the product is on sale
                  const saleCheck =
                    isSaleLoaded &&
                    allSaleProducts.find(
                      (saleProduct) => product._id === saleProduct._id
                    );

                  // If product is on sale, replace the product data with the sale product data
                  if (saleCheck) {
                    product = saleCheck;
                  }
                  return (
                    <ProductWrapper key={index}>
                      <ImageContainer>
                        <Image
                          onClick={() => {
                            history.push(`/items/${product._id}`);
                          }}
                          src={product.imageSrc}
                        />
                      </ImageContainer>
                      <DetailSection>
                        <Title>
                          {product.length !== 0
                            ? product.name.split(" ")[0].toUpperCase()
                            : null}
                        </Title>
                        <Description>{product.name}</Description>
                        <PriceContainer>
                          {product.salePrice ? (
                            <SalePriceContainer>
                              <OldPrice>{product.price}</OldPrice>
                              <NewPrice>{product.salePrice}</NewPrice>
                            </SalePriceContainer>
                          ) : (
                            <Price>{product.price}</Price>
                          )}
                        </PriceContainer>
                      </DetailSection>
                      <DetailTools>
                        <QuantitySection>
                          <FirstSquare
                            onClick={() => {
                              const existingProduct = [];
                              for (let i = 0; i < cartItems.length; i++) {
                                if (cartItems[i]._id === product._id) {
                                  if (
                                    product.numInStock >=
                                      cartItems[i].selectedItem &&
                                    cartItems[i].selectedItem > 1
                                  ) {
                                    setCartIconQuantity(cartIconQuantity - 1);
                                    setAllItemsAmount(allItemsAmount - 1);
                                    existingProduct.push({
                                      ...cartItems[i],
                                      selectedItem:
                                        cartItems[i].selectedItem - 1,
                                    });
                                    cartItems.splice(i, 1);
                                  } else {
                                    return null;
                                  }

                                  cartItems.push(existingProduct[0]);
                                  localStorage.setItem(
                                    "cartItems",
                                    JSON.stringify(cartItems)
                                  );
                                }
                              }
                              quality.forEach((item, index, arr) => {
                                if (item._id === product._id) {
                                  arr.splice(index, 1);
                                  setQuality([...quality, existingProduct[0]]);
                                }
                              });
                            }}
                          >
                            -
                          </FirstSquare>
                          {quality.map((item, index) => {
                            if (item._id === product._id) {
                              return (
                                <SecondSquare key={index}>
                                  {item.selectedItem}
                                </SecondSquare>
                              );
                            } else {
                              return null;
                            }
                          })}

                          <ThirdSquare
                            onClick={() => {
                              const existingProduct = [];
                              for (let i = 0; i < cartItems.length; i++) {
                                if (cartItems[i]._id === product._id) {
                                  if (
                                    product.numInStock >
                                    cartItems[i].selectedItem
                                  ) {
                                    setCartIconQuantity(cartIconQuantity + 1);
                                    setAllItemsAmount(allItemsAmount + 1);

                                    existingProduct.push({
                                      ...cartItems[i],
                                      selectedItem:
                                        cartItems[i].selectedItem + 1,
                                    });
                                    cartItems.splice(i, 1);
                                  } else {
                                    return null;
                                  }

                                  cartItems.push(existingProduct[0]);
                                  localStorage.setItem(
                                    "cartItems",
                                    JSON.stringify(cartItems)
                                  );
                                }
                              }
                              quality.forEach((item, index, arr) => {
                                if (item._id === product._id) {
                                  arr.splice(index, 1);
                                  setQuality([...quality, existingProduct[0]]);
                                }
                              });
                            }}
                          >
                            +
                          </ThirdSquare>
                        </QuantitySection>
                        <DeleteButton
                          onClick={() =>
                            handleDelete(product._id, product.selectedItem)
                          }
                        >
                          <DeleteIcon />
                        </DeleteButton>
                      </DetailTools>
                    </ProductWrapper>
                  );
                })}
            </ProductsContainer>
            {sumAll && productsInCart.length > 0 ? (
              <SummaryContainer>
                <SummarySection>
                  <SummaryTitle>
                    ORDER SUMMARY ({allItemsAmount} items)
                  </SummaryTitle>

                  <FlexDiv>
                    <div>SUBTOTAL</div>
                    <div>{`$${sumAll}`}</div>
                  </FlexDiv>

                  <FlexDiv>
                    <div>SHIPPING(TAX FREE)</div>
                    <div>${sumAll >= 100 ? 0 : 25}</div>
                  </FlexDiv>

                  <FlexDiv>
                    <div>TAX(%15)</div>
                    <div>{`$${((sumAll * 15) / 100).toFixed(2)}`}</div>
                  </FlexDiv>

                  <Line />

                  <FlexDiv>
                    <div>TOTAL</div>
                    <div>{`$${
                      sumAll >= 100
                        ? (sumAll * 1.15).toFixed(2)
                        : (sumAll * 1.15 + 25).toFixed(2)
                    }`}</div>
                  </FlexDiv>

                  <Button onClick={() => handleCheckout()}>CHECKOUT</Button>
                  <H4>*Free Shipping on all orders over $100.</H4>
                </SummarySection>
              </SummaryContainer>
            ) : (
              <LoadingCircle />
            )}
          </Wrapper>
        ) : (
          <LoadingContainer>
            <LoadingCircle circleSize={40} />
          </LoadingContainer>
        )
      ) : (
        <Error>
          <p>Your cart is empty</p>
          <span>Couldn't find something you like?</span>
        </Error>
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

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 150px;
  height: calc(100vh - 310px);
`;

const SummaryContainer = styled.div``;

const DetailTools = styled.div`
  display: flex;
  align-items: center;
`;

const DeleteButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: transparent;
  border: none;
  margin-left: 17px;
`;

const DeleteIcon = styled(RiDeleteBinLine)`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: var(--content-width);
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 50px 0;
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 480px;
`;

const ProductsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 380px);
`;

const ProductWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 30px;
  /* border: 1px solid red; */
`;
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border: 1px solid var(--border);
`;
const Image = styled.img`
  width: 100px;
  height: 100px;
  cursor: pointer;
`;

const Title = styled.h1`
  font-size: 16px;
  margin-bottom: 13px;
`;

const Description = styled.span`
  max-width: 500px;
  font-family: var(--font-family);
  margin-bottom: 13px;
`;

const QuantitySection = styled.div`
  display: flex;
  width: 100px;
`;

const FirstSquare = styled.button`
  font-family: var(--font-family);
  font-size: 18px;
  font-weight: 400;
  width: 34px;
  height: 34px;
  /* padding: 4px; */
  border: 1px solid var(--light-grey);
  text-align: center;
  background-color: transparent;
  cursor: pointer;
`;

const SecondSquare = styled.div`
  font-family: var(--font-family);
  font-size: 14px;
  width: 34px;
  height: 34px;
  text-align: center;
  line-height: 33px;
  border: 1px solid var(--light-grey);
  border-left: none;
`;

const ThirdSquare = styled.button`
  font-family: var(--font-family);
  font-size: 18px;
  font-weight: 400;
  width: 34px;
  height: 34px;
  border: 1px solid var(--light-grey);
  background-color: transparent;
  border-left: none;
  cursor: pointer;
`;

const Price = styled.h2`
  color: var(--primary-color);
  font-size: 16px;
`;

const OldPrice = styled.h2`
  text-decoration: line-through;
  color: var(--grey);
  font-size: 16px;
`;

const NewPrice = styled.h2`
  color: var(--primary-color);
  font-size: 16px;
  margin-left: 10px;
`;

const SummarySection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
  border: 1px solid var(--border);
  width: 320px;
`;

const SummaryTitle = styled.h2`
  margin-bottom: 10px;
`;

const FlexDiv = styled.div`
  font-family: var(--font-family);
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const Line = styled.span`
  border-bottom: 1px solid var(--border);
  margin: 25px 0;
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
  margin-top: 40px;

  &:hover {
    background-color: var(--primary-color);
    color: #fff;
    cursor: pointer;
  }
`;

const SalePriceContainer = styled.div`
  display: flex;
`;

const PriceContainer = styled.div``;

const H4 = styled.h4`
  font-family: var(--font-family);
  font-weight: 600;
  font-size: 12px;
  margin-top: 20px;
`;

export default CartPage;
