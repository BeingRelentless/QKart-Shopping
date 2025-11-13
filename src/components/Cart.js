import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import "./Cart.css";

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
 *
=======
 * 
>>>>>>> theirs
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 * @param { Array.<{ productId: String, qty: Number }> } cartData

 * 

 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData = [], productsData = []) => {
  if (!cartData.length || !productsData.length) return [];

  //  Create a Map for quick lookups
  const productMap = new Map();
  productsData.forEach((product) => productMap.set(product._id, product));

  //  Build the cart items array efficiently
  return cartData
    .map((cartItem) => {
      const matchedProduct = productMap.get(cartItem.productId);
      if (!matchedProduct) return null;
      return {
        ...matchedProduct,
        productId: cartItem.productId,
        qty: cartItem.qty,
      };
    })
    .filter(Boolean); // remove null entries
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  if (!items.length) return 0;

  // Multiply cost × qty for each item and sum up
  return items.reduce((total, item) => {
    const itemTotal = item.cost * item.qty;
    return total + itemTotal;
  }, 0);
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ value, handleAdd, handleDelete }) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" sx={{ color: "#00A278" }} onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" sx={{ color: "#00A278" }} onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */

const Cart = ({ products, items = [], handleQuantity, isReadOnly = false }) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar(); 

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box
        className="cart"
        sx={{
          backgroundColor: "#fff",        // white cart box
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #E9F5E1",
          p: 3,
          m: 2,
        }}
      >
        {items.map(
          (item) =>
            item.qty > 0 && (
              <Box
              key={item._id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding="1rem"
              mb="0.75rem"
              sx={{
                borderBottom: isReadOnly ? "1px solid #E9F5E1" : "none",
                borderRadius: "8px",
                backgroundColor: "#fff",
              }}
              >
                {/* Product image */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 1,
                    overflow: "hidden",
                    flexShrink: 0,
                    bgcolor: "#fafafa",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "contain" }}
                  />
                </Box>

                {/* Product details */}
                <Box
                  ml={2}
                  flexGrow={1}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  sx={{ overflow: "hidden" }}
                >
                  {/* Product name */}
                  <Typography
                    variant="body1"
                    color="#3C3C3C"
                    fontWeight={500}
                    sx={{
                      whiteSpace: "wrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "180px",
                    }}
                  >
                    {item.name}
                  </Typography>

                  {isReadOnly ? (
                    <Box
                      mt={0.5}
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                      sx={{ maxWidth: "180px" }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        color="#3C3C3C"
                      >
                        Qty: {item.qty}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        color="#3C3C3C"
                      >
                        ${item.cost}
                      </Typography>
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center">
                      <ItemQuantity
                        value={item.qty}
                        handleAdd={() =>
                          handleQuantity(item.productId, item.qty + 1)
                        }
                        handleDelete={() =>
                          handleQuantity(item.productId, item.qty - 1)
                        }
                      />
                      <Typography
                        variant="body1"
                        fontWeight={700}
                        color="#3C3C3C"
                        sx={{ ml: 1 }}
                      >
                        ${item.cost}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )
        )}

        {/* Order total */}
        <Box
          padding="0.75rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography color="#3C3C3C">Order total</Typography>
          <Typography
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.2rem"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Typography>
        </Box>

        {/* Checkout button (only visible when not read-only) */}
        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              sx={{
                backgroundColor: "#00A278",
                "&:hover": { backgroundColor: "#008c65" },
              }}
              onClick={() => {
                const token = localStorage.getItem('token')
                if(token){
                  history.push("/checkout")
                }else{
                  enqueueSnackbar("Login to place order", {variant : "error"})
                  history.push("/login")
                }
              }}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Cart;
