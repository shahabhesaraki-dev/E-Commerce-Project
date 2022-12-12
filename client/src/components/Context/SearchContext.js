import { useState, createContext, useEffect } from "react";

export const SearchContext = createContext(null);

export const SearchContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://myecommerceapps.herokuapp.com/api/find-products/:query")
      .then(async (res) => res.json())
      .then(async (data) => {
        setProducts(data.data);
      })
      .catch((error) => {
        console.log("error message", error);
      });
  }, []);

  return (
    <SearchContext.Provider
      value={{
        product: products,
        setProducts,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
