import { useState, createContext, useEffect } from "react";

export const HomeContext = createContext(null);

export const HomeContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recomendedProducts, setRecomendedProducts] = useState();
  const [isRecommendedLoaded, setIsRecomendedLoaded] = useState(false);
  const [saleProducts, setSaleProducts] = useState();
  const [allSaleProducts, setAllSaleProducts] = useState();
  const [isSaleLoaded, setIsSaleLoaded] = useState(false);
  const [popularProducts, setPopularProducts] = useState();
  const [isPopularLoaded, setIsPopularLoaded] = useState(false);

  const fetchCartItems = JSON.parse(localStorage.getItem("cartItems"));
  let totalQuantity = 1;
  fetchCartItems &&
    fetchCartItems.map((product) => {
      return (totalQuantity += product.selectedItem);
    });

  const [cartIconQuantity, setCartIconQuantity] = useState(totalQuantity);

  useEffect(() => {
    fetch("/api/get-products")
      .then(async (res) => res.json())
      .then(async (data) => {
        setProducts(data.data);
      })
      .catch((error) => {
        console.log("error message", error);
      });
  }, []);

  useEffect(() => {
    fetch("/api/get-categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data);
      })
      .catch((error) => {
        console.log("error message", error);
      });
  }, []);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      const response = await fetch("/api/get-recommended-products");
      const result = await response.json();
      setRecomendedProducts(result.data);
      setIsRecomendedLoaded(true);
    };

    const fetchSaleProducts = async () => {
      const response = await fetch("/api/get-sale-products");
      const result = await response.json();
      setSaleProducts(result.data.saleProducts);
      setAllSaleProducts(result.data.allSaleProducts);
      setIsSaleLoaded(true);
    };

    const fetchPopularProducts = async () => {
      const response = await fetch("/api/get-popular-products");
      const result = await response.json();
      setPopularProducts(result.data);
      setIsPopularLoaded(true);
    };

    fetchRecommendedProducts();
    fetchSaleProducts();
    fetchPopularProducts();
  }, []);

  return (
    <HomeContext.Provider
      value={{
        products,
        categories,
        recomendedProducts,
        isRecommendedLoaded,
        saleProducts,
        allSaleProducts,
        isSaleLoaded,
        popularProducts,
        isPopularLoaded,
        cartIconQuantity,
        setCartIconQuantity,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
