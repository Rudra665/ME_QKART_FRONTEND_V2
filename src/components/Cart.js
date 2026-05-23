import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
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
 */

/**
 * @typedef {Object} CartItem - Data on product added to cart
 * * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData || !productsData) return [];

  const completeCartItems = cartData.map((cartItem) => {
    const productDetails = productsData.find(
      (product) => product._id === cartItem.productId
    );

    if (productDetails) {
      return {
        ...productDetails,
        productId: cartItem.productId,
        qty: cartItem.qty,
      };
    }
    return null;
  }).filter(item => item !== null); 

  return completeCartItems;
};

/**
 * Get the total value of all products added to the cart
 */
export const getTotalCartValue = (items = []) => {
  if (!items.length) return 0;

  const total = items.reduce((accumulator, currentItem) => {
    return accumulator + (currentItem.cost * currentItem.qty);
  }, 0);

  return total;
};

// Place this after getTotalCartValue
export const getTotalItems = (items = []) => {
  if (!items.length) return 0;
  return items.reduce((total, item) => total + item.qty, 0);
};

/**
 * Component to display the current quantity for a product and + and - buttons
 */
 const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly,        // ← add this prop
}) => {
  if (isReadOnly) {
    return (
      <Box padding="0.5rem" data-testid="item-qty">
        Qty: {value}
      </Box>
    );
  }

  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
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
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
 const Cart = ({
  products,
  items = [],
  handleQuantity,
  isReadOnly,        // ← add this prop
}) => {
  const history = useHistory();
  const token = localStorage.getItem("token");

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
      <Box className="cart">
        {items.map((item) => (
          <Box key={item.productId}>
            <Box display="flex" alignItems="flex-start" padding="1rem">
              <Box className="cart-image-container">
                <img src={item.image} alt={item.name} width="100px" height="100%" />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                className="cart-text-container"
              >
                <Box color="#3C3C3C" fontSize="1rem">
                  {item.name}
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  
                  {/* ✅ Pass isReadOnly to ItemQuantity */}
                  <ItemQuantity
                    value={item.qty}
                    handleAdd={async () => {
                      await handleQuantity(token, items, item.productId, item.qty + 1);
                    }}
                    handleDelete={async () => {
                      await handleQuantity(token, items, item.productId, item.qty - 1);
                    }}
                    isReadOnly={isReadOnly}
                  />

                  <Box padding="0.5rem" fontWeight="700">
                    ${item.cost}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}

        {/* Order Total */}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">Order total</Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        {/* ✅ Checkout button — hidden on Checkout page */}
        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              style={{ backgroundColor: "#00a278" }}
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => history.push("/checkout")}
            >
              Checkout
            </Button>
          </Box>
        )}
        </Box>
        <Box>
        {/* ✅ Order Details section — only on Checkout page */}
        {isReadOnly && (
          <Box className="cart" padding="1rem" marginTop="10px">
            <Typography variant="h5" fontWeight="700" my="1rem">
              Order Details
            </Typography>
            <Box display="flex" justifyContent="space-between" my="0.5rem">
              <Box color="#3C3C3C">Products</Box>
              <Box>{getTotalItems(items)}</Box>
            </Box>
            <Box display="flex" justifyContent="space-between" my="0.5rem">
              <Box color="#3C3C3C">Subtotal</Box>
              <Box>${getTotalCartValue(items)}</Box>
            </Box>
            <Box display="flex" justifyContent="space-between" my="0.5rem">
              <Box color="#3C3C3C">Shipping charges</Box>
              <Box>$0</Box>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              my="0.5rem"
              fontWeight="700"
              fontSize="1.2rem"
            >
              <Box>Total</Box>
              <Box>${getTotalCartValue(items)}</Box>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Cart;
