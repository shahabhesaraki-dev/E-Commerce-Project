import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { HomeContext } from "../Context/HomeContext";
import Header from "../Header";
import Footer from "../Footer";
import ProductCard from "../Homepage/Products/ProductCard";
import LoadingCircle from "../LoadingCircle";
import styled from "styled-components";
import { GiRabbit } from "react-icons/gi";

const SearchPage = () => {
  const { query } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchResultsLoaded, setIsSearchResultsLoaded] = useState(false);
  const { isSaleLoaded, allSaleProducts } = useContext(HomeContext);
  const [sortButtonState, updateButtonState] = useState("none");
  const [numberOfProducts, setNumberOfProducts] = useState();
  const [error, setError] = useState();

  const sortChange = (option) => {
    updateButtonState(option.target.value);
  };

  if (sortButtonState === "highToLow") {
    searchResults.sort((productA, productB) => {
      return productB.intPrice - productA.intPrice;
    });
  } else if (sortButtonState === "lowToHigh") {
    searchResults.sort((productA, productB) => {
      return productA.intPrice - productB.intPrice;
    });
  } else if (sortButtonState === "none") {
    searchResults.sort((productA, productB) => {
      return productA._id - productB._id;
    });
  }

  const handleClick = () => {
    setNumberOfProducts((prevState) => (prevState += 10));
  };

  useEffect(() => {
    const findProducts = async () => {
      const response = await fetch(`/api/find-products/${query}`);
      const result = await response.json();
      result.status === 200
        ? setSearchResults(result.data)
        : setError(result.message);
      setIsSearchResultsLoaded(true);
      setNumberOfProducts(10);
    };
    findProducts();
  }, [query]);

  return (
    <Wrapper>
      <Container>
        <Header />
        {!error ? (
          <>
            {isSearchResultsLoaded ? (
              <>
                <ContentWrapper>
                  <ToolsContainer>
                    <StatusContainer>
                      Search results for <Searched>"{query}"</Searched> (
                      {searchResults.length} Products found)
                    </StatusContainer>
                    <Select id="sortType" onChange={sortChange}>
                      <option value="none">Default</option>
                      <option value="highToLow">Price: Hight to Low</option>
                      <option value="lowToHigh">Price: Low to High</option>
                    </Select>
                  </ToolsContainer>

                  <ResultsWrapper>
                    {searchResults
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
                        return (
                          <ProductCard productData={productData} key={index} />
                        );
                      })}
                  </ResultsWrapper>
                </ContentWrapper>
                <ShowMoreWrapper>
                  {searchResults && (
                    <NumbersLeft>
                      {numberOfProducts > searchResults.length
                        ? searchResults.length
                        : numberOfProducts}{" "}
                      of {searchResults.length}
                    </NumbersLeft>
                  )}
                  {searchResults.length > numberOfProducts && (
                    <Button onClick={handleClick}>Show More</Button>
                  )}
                </ShowMoreWrapper>
              </>
            ) : (
              <LoadingContainer>
                <LoadingCircle circleSize={40} />
              </LoadingContainer>
            )}
          </>
        ) : (
          <Error>
            <ErrorIcon />
            <p>Couldn't find any "{query}" !</p>
          </Error>
        )}

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

const ErrorIcon = styled(GiRabbit)`
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 150px;
  height: calc(100vh - 310px);
`;

const ToolsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ShowMoreWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
`;

const ContentWrapper = styled.div`
  margin-top: 70px;
`;

const Select = styled.select`
  font-family: var(--font-family);
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  border: none;
  border-bottom: 1px solid var(--border);

  &:focus {
    outline: none;
  }
`;
const Searched = styled.span`
  font-family: var(--font-family);
  font-weight: bold;
  display: inline-block;
`;
const NumbersLeft = styled.h2`
  font-weight: 400;
  margin-bottom: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const Container = styled.div`
  width: var(--content-width);
`;
const ResultsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 30px;
  grid-row-gap: 30px;
  margin-bottom: 60px;
  margin-top: 40px;
`;

const StatusContainer = styled.span`
  font-family: var(--font-family);
  font-size: 16px;
  margin-bottom: 10px;
  text-transform: uppercase;
`;
const Button = styled.button`
  font-family: var(--font-family);
  width: 275px;
  height: 45px;
  margin: auto;
  font-weight: bold;
  display: block;
  margin-bottom: 15px;
  text-transform: uppercase;
  border: 1px solid var(--primary-color);
  background-color: transparent;
  :hover {
    background-color: var(--primary-color);
    cursor: pointer;
    color: #fff;
  }
`;
export default SearchPage;
