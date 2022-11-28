import { BrowserRouter, Switch, Route } from "react-router-dom";
import Homepage from "./Homepage";
import GlobalStyles from "./GlobalStyles";
import styled from "styled-components";
import ItemPage from "./Homepage/Products/ItemPage";
import CartPage from "./Cart/CartPage";
import SearchPage from "./Search/SearchPage";
import Category from "./Category";
import ConfirmationPage from "./ConfirmationPage";
import NotFound from "./NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Wrapper>
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route exact path="/items/:id">
            <ItemPage />
          </Route>
          <Route exact path="/category/:categoryName">
            <Category />
          </Route>
          <Route exact path="/cart">
            <CartPage />
          </Route>
          <Route exact path="/search/:query">
            <SearchPage />
          </Route>
          <Route exact path="/confirmation">
            <ConfirmationPage />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Wrapper>
    </BrowserRouter>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export default App;
