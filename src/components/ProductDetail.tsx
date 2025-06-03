import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  Grid,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import productService from "../lib/product.service";
import { useAuth } from "./AuthContext";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState<number>(1);

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(Number(id)),
    enabled: !!id,
  });

  const handleAddToCart = () => {
    // This would be implemented with a cart service
    alert(`Added ${quantity} of ${product?.name} to cart`);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !product) {
    return (
      <Container>
        <Alert severity="error">
          Error loading product: {(error as Error).message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6} component={"div" as React.ElementType}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Box
              component="img"
              src={
                product.imageUrl ||
                "https://via.placeholder.com/600x400?text=No+Image"
              }
              alt={product.name}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "500px",
                objectFit: "contain",
              }}
            />
          </Paper>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6} component={"div" as React.ElementType}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="h5" color="primary" sx={{ mr: 2 }}>
                ${product.price.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Seller: {product.seller.username}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Category: {product.category}
              </Typography>
              {/* <Typography variant="body2" color="text.secondary">
                Listed on: {new Date(product.createdAt).toLocaleDateString()}
              </Typography> */}
            </Box>

            {isAuthenticated && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Quantity:
                </Typography>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  inputProps={{ min: 1 }}
                  sx={{ width: "100px", mr: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleAddToCart}
                  sx={{ mt: 1 }}
                >
                  Add to Cart
                </Button>
              </Box>
            )}

            {!isAuthenticated && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate("/login")}
                sx={{ mt: 2 }}
              >
                Login to Purchase
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
