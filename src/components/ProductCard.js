import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import { AddShoppingCartOutlined } from "@mui/icons-material";
import "./ProductCard.css";



const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card
      className="card"
      sx={{
        mt : 1,
        borderRadius: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease-in-out",
        "&:hover": { transform: "scale(1.02)" },
      }}
    >
      {/* Product Image */}
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
      />

      {/* Product Details */}
      <CardContent sx={{ textAlign: "left" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "#2E7D32", mb: 0.5 }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontSize: "0.9rem" }}
        >
          {product.category}
        </Typography>

        <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 0.5 }}>
          ${product.cost}
        </Typography>

        <Rating
          name="read-only"
          value={product.rating}
          precision={0.5}
          readOnly
          sx={{ mt: 0.5 }}
        />
      </CardContent>

      {/* Add to Cart Button */}
      <CardActions className="card-actions" sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddShoppingCartOutlined />}
          className="card-button"
          onClick={() => handleAddToCart(product)}
          sx={{
            width: "90%",
            py: 1,
            borderRadius: 1.5,
            backgroundColor: "#2E7D32",
            "&:hover": { backgroundColor: "#256928" },
          }}
        >
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
