import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import SearchIcon from "@mui/icons-material/Search";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import { generateCartItemsFrom } from "./Cart"; 
import "./Products.css";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [debounceTimeout, setDebounceTimeout] = useState("");

  const token = localStorage.getItem("token");
  const isLoggedIn = token ? true : false;

  const addToCart = async (token, items, productId, qty, options = {}) => {
    if (!token) {
      enqueueSnackbar("Login to add items to the cart", { variant: "warning" });
      return;
    }
  
    if (options.preventDuplicate && items.some((item) => item.productId === productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    }
  
    try {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const cartData = generateCartItemsFrom(response.data, products);
      setCartItems(cartData); 
  
      enqueueSnackbar("Cart updated successfully", { variant: "success" });
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not add item to cart. Try again later.", { variant: "error" });
      }
    }
  };

  const fetchCart = async (token) => {
    if (!token) return null;
  
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not fetch cart details. Check that the backend is running", { variant: "error" });
      }
      return null;
    }
  };


  useEffect(() => {
    const onLoadHandler = async () => {
      setLoading(true);
      try {
        // 1. पहले प्रोडक्ट्स लिस्ट लाएँ
        const productsResponse = await axios.get(`${config.endpoint}/products`);
        setProducts(productsResponse.data);
        
        // 2. प्रोडक्ट्स मिलने के तुरंत बाद कार्ट डेटा प्रोसेस करें
        if (token) {
          const cartData = await fetchCart(token);
          if (cartData) {
            const completeCart = generateCartItemsFrom(cartData, productsResponse.data);
            setCartItems(completeCart);
          }
        }
      } catch (error) {
        enqueueSnackbar("Error loading page data", { variant: "error" });
      }
      setLoading(false);
    };
  
    onLoadHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const performSearch = async (text) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setProducts(response.data);
    } catch (e) {
      setProducts([]);
    }
    setLoading(false);
  };

  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      performSearch(value);
    }, 900);

    setDebounceTimeout(timeout);
  };

  return (
    <>
      <div>
        <Header>
          <div className="search-desktop">
            <TextField
              id="outlined-basic"
              placeholder="Search for items/categories"
              variant="outlined"
              onChange={(e) => debounceSearch(e, debounceTimeout)}
              sx={{
                width: "55ch",
                backgroundColor: "#ffffff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#00a278 !important",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#00a278 !important",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#00a278 !important",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: "#00a278" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </Header>

        <Box display={{ xs: "block", md: "none" }} m={1}>
          <div className="search-mobile">
            <TextField
              id="outlined-basic"
              fullWidth
              placeholder="Search for items/categories"
              variant="outlined"
              onChange={(e) => debounceSearch(e, debounceTimeout)}
              sx={{
                backgroundColor: "#ffffff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#00a278 !important",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#00a278 !important",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#00a278 !important",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: "#00a278" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </Box>

        <Grid container>
          <Grid item xs={12} md={isLoggedIn ? 9 : 12} className="product-grid">
            <Grid container spacing={2} style={{ marginTop: 0 }}>
              <Grid item xs={12}>
                <Box className="hero">
                  <p className="hero-heading">
                    India’s{" "}
                    <span className="hero-highlight">FASTEST DELIVERY</span> to
                    your door step
                  </p>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box className="container">
                  {loading ? (
                    <div className="loading">
                      <CircularProgress color="success" />
                      <p>Loading Products...</p>
                    </div>
                  ) : !loading && products.length > 0 ? (
                    <Grid container spacing={2}>
                      {products.map((item) => (
                        <Grid item xs={6} md={3} key={item._id}> 
                          <ProductCard 
                            product={item} 
                            handleAddToCart={async () => {
                              await addToCart(token, cartItems, item._id, 1, { preventDuplicate: true });
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box className="loading">
                      <SentimentVeryDissatisfiedIcon />
                      <p>No products found</p>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {isLoggedIn && (
            <Grid item xs={12} md={3} style={{ backgroundColor: "#E9F5E1" }}>
              <Cart 
                products={products} 
                items={cartItems} 
                handleQuantity={async (userToken, items, productId, qty) => {
                  await addToCart(userToken, items, productId, qty);
                }}
              />
            </Grid>
          )}
        </Grid>
        <Footer />
      </div>
    </>
  );
};

export default Products;
