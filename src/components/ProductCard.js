import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        alt="green iguana"
        height="auto"
        image={product.image}
      />
      <CardContent>
        <Typography gutterBottom variant="p" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          ${product.cost}
        </Typography>
        <Rating 
          name="read-only" 
          value={product.rating} // Use value instead of defaultValue for consistency
          precision={0.5} 
          readOnly 
          aria-label="stars" 
        />
      </CardContent>
      <CardActions className="card-actions">
        <Button size="small" variant="contained" className="card-button" fullWidth startIcon={<AddShoppingCartIcon />} onClick={handleAddToCart}>Add to cart</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
