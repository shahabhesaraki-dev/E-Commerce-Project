import styled from "styled-components";
import Header from "./Header";
import { FaCheckCircle } from "react-icons/fa";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { HomeContext } from "./Context/HomeContext";
import { getRandomKey } from "../utils";

const ConfirmationPage = () => {
  const { allSaleProducts, isSaleLoaded } = useContext(HomeContext);
  const confirmedBuy = JSON.parse(localStorage.getItem("confirmedBuy"));
  let total = 0;

  const findQuantity = (id) => {
    const itemIndex = confirmedBuy.findIndex((item) => item._id === id);
    return confirmedBuy[itemIndex].selectedItem;
  };

  const productsInCart = useLocation();
  const productsWithSale =
    productsInCart &&
    productsInCart.state.map((product) => {
      // Check if the product is on sale
      const saleCheck =
        isSaleLoaded &&
        allSaleProducts.find((saleProduct) => product._id === saleProduct._id);

      // If product is on sale, replace the product data with the sale product data
      if (saleCheck) {
        return (product = saleCheck);
      } else {
        return product;
      }
    });

  return (
    <Wrapper>
      <Container>
        <Header />
      </Container>

      <Container>
        <OrderConfirmed>
          <ConfirmedWrapper>
            <CheckCircle />
            <OrderText>ORDER CONFIRMED</OrderText>
          </ConfirmedWrapper>
          <OrderThankYou>Thank you for your order!</OrderThankYou>
        </OrderConfirmed>

        <OrderDetails>
          <OrderNumberWrapper>
            <OrderNumberText>Order:</OrderNumberText>
            <OrderNumber>{"#" + getRandomKey()}</OrderNumber>
          </OrderNumberWrapper>
          {productsWithSale.map((product) => {
            product.salePrice
              ? (total +=
                  parseFloat(product.salePrice.replace(/["$,]/g, "")) *
                  findQuantity(product._id))
              : (total +=
                  parseFloat(product.price.replace(/["$,]/g, "")) *
                  findQuantity(product._id));
            return (
              <ItemsPurchased key={product._id}>
                <ItemWrapper>
                  <ItemName>{product.name}</ItemName>
                  <PriceWrapper>
                    <Quantity>
                      {findQuantity(product._id) > 1 &&
                        "x" + findQuantity(product._id)}
                    </Quantity>
                    {product.salePrice ? (
                      <Price>{product.salePrice}</Price>
                    ) : (
                      <Price>{product.price}</Price>
                    )}
                  </PriceWrapper>
                </ItemWrapper>
              </ItemsPurchased>
            );
          })}

          <TotalWrapper>
            <Total>TOTAL</Total>
            <TotalPrice>${total.toFixed(2)}</TotalPrice>
          </TotalWrapper>
        </OrderDetails>
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

const PriceWrapper = styled.div`
  display: flex;
  padding-bottom: 20px;
`;

const TotalWrapper = styled.div`
  width: 100%;
  text-align: right;
  margin-top: 40px;
`;

const TotalPrice = styled.span`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
`;

const Total = styled.span`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  margin-right: 30px;

  letter-spacing: -0.05em;
`;

const Quantity = styled.span`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 113.5%;
  margin-right: 50px;
`;

const Price = styled.p`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  /* line-height: 113.5%; */
`;

const ItemName = styled.p`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid #e6e6e6;
`;

const ItemsPurchased = styled.div`
  margin-top: 20px;
`;

const OrderNumber = styled.span`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  margin-left: 10px;
`;
const OrderNumberText = styled.h2`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
`;

const OrderNumberWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 40px;
`;

const OrderDetails = styled.div`
  border: 1px solid #c1c1c1;
  padding: 50px;
  width: 960px;
  margin: auto;
  margin-bottom: 75px;
`;

const ConfirmedWrapper = styled.span`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const CheckCircle = styled(FaCheckCircle)`
  width: 20px;
  height: 20px;
  color: #75c269;
  margin-right: 7px;
`;
const OrderText = styled.h2`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
`;
const OrderThankYou = styled.h4`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  margin-top: 10px;
`;
const OrderConfirmed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
  margin-bottom: 50px;
`;

export default ConfirmationPage;
