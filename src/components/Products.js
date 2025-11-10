import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar(); // ✅ fixed spelling

  const performAPICall = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong!", { variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  //Run the performAPICall on first render
  useEffect(() => {
    performAPICall();
  }, []);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const [searchText, setSearchText] = useState("");

  const performSearch = async (searchText) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${searchText}`
      );

      // console.log(response);
      setProducts(response.data);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        setProducts([]);
      } else {
        enqueueSnackbar(`Something went wrong!`, { variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    setSearchText(value);

    // Clear previous timeout if user is still typing
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      if (value.trim() !== "") {
        performSearch(value);
      } else {
        performAPICall(); // If input cleared, show all products again
      }
    }, 500); // wait 500ms

    setDebounceTimeout(newTimeout);
  };

  // ✅ Placeholder for cart handling
  const handleAddToCart = (product) => {
    enqueueSnackbar(`${product.name} added to cart!`, { variant: "success" });
  };

  return (
    <div>
      <Header>
        {/* Desktop search bar (visible on large screens) */}
        <TextField
          className="search-desktop"
          size="small"
          // fullWidth
          onChange={(e) => debounceSearch(e, debounceTimeout)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
        />
      </Header>

      {/* Mobile search bar (visible only on small screens) */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        onChange={(e) => debounceSearch(e, debounceTimeout)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Box className="hero">
        <p className="hero-heading">
          India’s <span className="hero-highlight">FASTEST DELIVERY</span> to
          your door step
        </p>
      </Box>

      {/* ---------- PRODUCT SECTION ---------- */}
      {loading ? (
        // 🌀 Loader while fetching products
        <Box className="loading">
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading Products
          </Typography>
        </Box>
      ) : products.length > 0 ? (
        // ✅ Display products in a responsive grid
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ padding: "1rem 2rem 4rem" }}
        >
          {products.map((product) => (
            <Grid item key={product._id} xs={6} md={3}>
              <ProductCard
                product={product}
                handleAddToCart={handleAddToCart}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        // ❌ No products found (empty state)
        <Box
          sx={{
            textAlign: "center",
            padding: "4rem",
            color: "gray",
          }}
        >
          <SentimentDissatisfied sx={{ fontSize: 60 }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            No products found
          </Typography>
        </Box>
      )}

      <Footer />
    </div>
  );
};

export default Products;
