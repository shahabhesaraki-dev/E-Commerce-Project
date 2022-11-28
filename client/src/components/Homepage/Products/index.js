import styled from "styled-components";
import RecomendedProducts from "./RecomendedProducts";
import SaleProducts from "./SaleProducts";
import PopularProducts from "./PopularProducts";

const Products = () => {
  return (
    <Wrapper>
      <ProductsSectionTitle>
        <h2>Recommended Products</h2>
        <Line />
      </ProductsSectionTitle>
      <RecomendedProducts />
      <ProductsSectionTitle>
        <h2>Sale Products</h2>
        <Line />
      </ProductsSectionTitle>
      <SaleProducts />
      <ProductsSectionTitle>
        <h2>Popular Products</h2>
        <Line />
      </ProductsSectionTitle>
      <PopularProducts />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-bottom: 100px;
`;

const ProductsSectionTitle = styled.div`
  height: 80px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family);
  text-transform: uppercase;
  margin-top: 30px;
  & h2 {
    font-weight: 400;
    z-index: 1;
    background-color: #fff;
    padding: 0 30px;
  }
`;

const Line = styled.hr`
  width: 100%;
  border: 1px solid var(--lightest-grey);
  position: absolute;
`;
export default Products;
