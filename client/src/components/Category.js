import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { HomeContext } from "./Context/HomeContext";
import ProductCard from "./Homepage/Products/ProductCard";
import Header from "./Header";
import Footer from "./Footer";
import LoadingCircle from "./LoadingCircle";
import { IoFitnessSharp } from "react-icons/io5";
import { BsStack } from "react-icons/bs";
import { SiCoffeescript } from "react-icons/si";
import { MdHealthAndSafety } from "react-icons/md";
import { SiAzurefunctions } from "react-icons/si";
import { MdPets } from "react-icons/md";
import { BsGearFill } from "react-icons/bs";
import { IoGameController } from "react-icons/io5";
import { MdWrongLocation } from "react-icons/md";

import styled from "styled-components";

const Category = () => {
  const { categoryName } = useParams();

  console.log(categoryName);
  const { products, allSaleProducts, isSaleLoaded, categories } =
    useContext(HomeContext);

  const lowerCaseCategories = categories.map((category) => {
    return category.toLowerCase();
  });

  const categoryProducts =
    // If we go to all products page, category products are all products.
    categoryName === "all"
      ? products
      : // Else, filter the all products with the category name that we went to its page.
        products.filter(
          (product) =>
            product.category.toLowerCase() === categoryName.toLowerCase()
        );

  // Number state for updating the rendered products number
  const [numberOfProducts, setNumberOfProducts] = useState();

  // When button clicked, add 12 to prev number state
  const handleClick = () => {
    setNumberOfProducts((prevState) => (prevState += 10));
  };

  // If category name updates that means we went to a different category page,
  // so reset the rendered products number to 10.
  useEffect(() => {
    setNumberOfProducts(10);
  }, [categoryName]);

  return (
    <Wrapper>
      <Container>
        <Header />
      </Container>

      {(categories &&
        lowerCaseCategories.includes(categoryName.toLowerCase())) ||
      categoryName === "all" ? (
        <>
          {categoryProducts.length > 0 ? (
            <Container>
              <TitleWrapper>
                <TitleContainer>
                  {(categoryName.toLowerCase() === "all" && <AllIcon />) ||
                    (categoryName.toLowerCase() === "fitness" && (
                      <FitnessIcon />
                    )) ||
                    (categoryName.toLowerCase() === "lifestyle" && (
                      <LifeStyleIcon />
                    )) ||
                    (categoryName.toLowerCase() === "medical" && (
                      <MedicalIcon />
                    )) ||
                    (categoryName.toLowerCase() === "entertainment" && (
                      <EntertainmentIcon />
                    )) ||
                    (categoryName.toLowerCase() === "pets and animals" && (
                      <PetsIcon />
                    )) ||
                    (categoryName.toLowerCase() === "industrial" && (
                      <IndustrialIcon />
                    )) ||
                    (categoryName.toLowerCase() === "gaming" && <GameIcon />)}
                  <TitleText>{categoryName.toUpperCase()} PRODUCTS</TitleText>
                </TitleContainer>
              </TitleWrapper>

              <ResultsWrapper>
                {categoryProducts
                  .slice(0, numberOfProducts)
                  .map((productData, index) => {
                    // Check if the product is on sale
                    const saleCheck =
                      isSaleLoaded &&
                      allSaleProducts.find(
                        (saleProduct) => productData._id === saleProduct._id
                      );

                    // If product is on sale, replace the product data with the sale product data
                    if (saleCheck) {
                      productData = saleCheck;
                    }

                    // If product category is the current category, render these items
                    if (
                      productData.category.toLowerCase() ===
                      categoryName.toLowerCase()
                    ) {
                      return (
                        <ProductCard productData={productData} key={index} />
                      );
                    } else {
                      // Else, that means we are in all products, so render all without filter
                      return (
                        <ProductCard productData={productData} key={index} />
                      );
                    }
                  })}
              </ResultsWrapper>

              {products && categoryProducts && (
                <ShowMoreWrapper>
                  <RenderedProductsStatus>
                    {/* If number of products which will render are more than actual products number, 
          make actual product number is total */}
                    {numberOfProducts > categoryProducts.length
                      ? categoryProducts.length
                      : numberOfProducts}{" "}
                    of {categoryProducts.length}
                  </RenderedProductsStatus>
                  {/* If there are still category products which didnt appear, show the
            button */}
                  {categoryProducts.length > numberOfProducts && (
                    <Button onClick={handleClick}>Show More</Button>
                  )}
                </ShowMoreWrapper>
              )}
            </Container>
          ) : (
            <LoadingContainer>
              <LoadingCircle circleSize={40} />
            </LoadingContainer>
          )}
        </>
      ) : (
        <Error>
          <ErrorIcon />
          <p>Are you making this up?</p>
          <span>There is no category like that!</span>
        </Error>
      )}

      <Container>
        <Footer />
      </Container>
    </Wrapper>
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

const ErrorIcon = styled(MdWrongLocation)`
  width: 70px;
  height: 70px;
  margin-bottom: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 12px;
  background-color: var(--lightest-grey);
  margin: 45px 0 40px 0;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 25px;
  background-color: #fff;
  padding: 0 15px;
`;

const TitleText = styled.span`
  font-size: 16px;
  font-family: var(--font-family);
  font-weight: 700;
  letter-spacing: -0.05em;
`;

const FitnessIcon = styled(IoFitnessSharp)`
  width: 26px;
  height: 26px;
  margin-right: 10px;
`;

const AllIcon = styled(BsStack)`
  width: 22px;
  height: 22px;
  margin-right: 10px;
`;

const LifeStyleIcon = styled(SiCoffeescript)`
  width: 22px;
  height: 22px;
  margin-right: 10px;
`;

const MedicalIcon = styled(MdHealthAndSafety)`
  width: 22px;
  height: 22px;
  margin-right: 10px;
`;

const EntertainmentIcon = styled(SiAzurefunctions)`
  width: 22px;
  height: 22px;
  margin-right: 10px;
`;

const PetsIcon = styled(MdPets)`
  width: 22px;
  height: 22px;
  margin-right: 10px;
`;

const IndustrialIcon = styled(BsGearFill)`
  width: 22px;
  height: 22px;
  margin-right: 10px;
`;

const GameIcon = styled(IoGameController)`
  width: 22px;
  height: 22px;
  margin-right: 10px;
`;

const Container = styled.div`
  width: var(--content-width);
`;

const ShowMoreWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
`;

const RenderedProductsStatus = styled.h2`
  font-weight: 400;
  margin-bottom: 20px;
`;

const ResultsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 30px;
  grid-row-gap: 30px;
  margin-bottom: 60px;
`;

const Button = styled.button`
  height: 45px;
  width: 275px;
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
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 150px;
  height: calc(100vh - 310px);
`;

export default Category;
