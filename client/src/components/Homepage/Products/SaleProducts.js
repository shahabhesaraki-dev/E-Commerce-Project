import { useContext } from "react";
import ProductCard from "./ProductCard";
import styled from "styled-components";
import { HomeContext } from "../../Context/HomeContext";
import LoadingCircle from "../../LoadingCircle";

const SaleProducts = () => {
  const { saleProducts, isSaleLoaded } = useContext(HomeContext);
  return (
    <Wrapper>
      {isSaleLoaded ? (
        saleProducts.map((productData, index) => {
          return <ProductCard productData={productData} key={index} />;
        })
      ) : (
        <LoadingCircle circleSize={30} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
export default SaleProducts;
