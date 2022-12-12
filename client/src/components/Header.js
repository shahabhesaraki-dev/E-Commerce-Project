import { useContext, useState } from "react";
import { NavLink, Link, useHistory } from "react-router-dom";
import { HomeContext } from "./Context/HomeContext";
import styled from "styled-components";
import logo from "../assets/smartwear.-logo.png";
import CartIcon from "../assets/cart.svg";

const Header = () => {
  const { categories, cartIconQuantity } = useContext(HomeContext);
  const [searchText, setSearchText] = useState("");
  const history = useHistory();

  const searchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <Wrapper>
      <Link to="/">
        <ImageLogo src={logo} />
      </Link>
      <Navigation>
        <LinkDiv>
          {categories.length !== 0 ? (
            <StyledLink to="/category/all">ALL</StyledLink>
          ) : null}
          {categories.map((category, index) => {
            return (
              <StyledLink
                to={`/category/${category.toLowerCase()}`}
                key={index}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {category.toUpperCase()}
              </StyledLink>
            );
          })}
        </LinkDiv>

        {categories.length !== 0 ? (
          <SearchContainer>
            <SearchInput
              placeholder="Search product here"
              onChange={searchChange}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  history.push(`/search/${searchText}`);
                  // window.location.reload();
                }
              }}
            />
            <SearchButton
              onClick={() => history.push(`/search/${searchText}`)}
            />
          </SearchContainer>
        ) : null}
        <Link to={"/cart"}>
          <Icon value={cartIconQuantity - 1}>
            <CartIconImg src={CartIcon}></CartIconImg>
          </Icon>
        </Link>
      </Navigation>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 10px;
  width: 100%;
  height: 40px;
`;

const Navigation = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const LinkDiv = styled.div`
  margin-right: 20px;
  margin-top: 9px;
`;

const CartIconImg = styled.img`
  width: 23px;
  height: 21px;
  position: relative;
  margin-left: 20px;
  color: var(--primary-color);
  &::after {
    content: attr(value);
    position: absolute;
    top: -5px;
    right: -5px;
    font-family: var(--font-family);
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    border-radius: 50px;
    background-color: var(--pink);
    padding: 3px 6px;
  }
`;

const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: var(--primary-color);
  font-family: var(--font-family);
  margin-left: 16px;
  letter-spacing: -0.05em;
  display: inline-block;
  font-weight: 400;

  &::after {
    content: "";
    display: block;
    margin-top: 10px;
  }

  &:hover {
    color: var(--pink);
  }

  &.active {
    font-weight: 700;
  }

  &.active::after {
    content: "";
    display: block;
    margin-top: 7px;
    margin-left: auto;
    margin-right: auto;
    width: 75%;
    height: 3px;
    background-color: var(--pink);
  }
  &.active:hover {
    color: var(--primary-color);
  }
`;

const ImageLogo = styled.img`
  width: 210px;
  height: 28px;
  margin-bottom: 8px;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 260px;
  height: 40px;
  border: 1px solid var(--border);
  position: relative;
`;

const SearchInput = styled.input`
  width: 220px;
  text-indent: 12px;
  color: var(--primary-color);
  border-radius: none;
  border-width: 0 1px 0 0;
  border-style: solid;
  border-color: var(--border);
  outline: none;
  font-size: 14px;
  font-family: var(--font-family);

  &::placeholder {
    color: var(--light-grey);
  }
`;

const SearchButton = styled.button`
  width: 40px;
  height: 100%;
  overflow: hidden;
  border: none;
  background: #fff
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E")
    no-repeat center;
  cursor: pointer;
`;

const Icon = styled.span`
  position: relative;
  &::after {
    content: attr(value);
    position: absolute;
    top: -15px;
    right: -10px;
    font-family: var(--font-family);
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    border-radius: 50px;
    background-color: var(--pink);
    padding: 3px 6px;
  }
`;
export default Header;
