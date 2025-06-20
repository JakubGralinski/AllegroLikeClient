import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import productService, { ProductFilters } from "../lib/product.service";
import { Product, Result } from "../lib/types";

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ProductFilters>({
    page: 0,
    size: 12,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [category, setCategory] = useState<string>("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm, page: 0 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update filters when category or price range changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: category || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      page: 0,
    }));
  }, [category, priceRange]);

  const { data, isLoading, isError, error } = useQuery<
    Result<Product[]>,
    Error
  >({
    queryKey: ["products", filters],
    queryFn: () => productService.getAllProducts(filters),
  });

  const products = data?.isSuccess ? data.content : [];

  const handlePageChange = (value: number) => {
    setFilters((prev) => ({ ...prev, page: value - 1 }));
  };

  const handleProductClick = (id: number) => {
    navigate(`/products/${id}`);
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

  if (isError) {
    return (
      <Container>
        <Alert severity="error">
          Error loading products: {(error as Error).message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Products
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} component={"div" as React.ElementType}>
            <TextField
              fullWidth
              label="Search products"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4} component={"div" as React.ElementType}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
                <MenuItem value="books">Books</MenuItem>
                <MenuItem value="home">Home & Garden</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} component={"div" as React.ElementType}>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={priceRange}
              onChange={(_, newValue) =>
                setPriceRange(newValue as [number, number])
              }
              valueLabelDisplay="auto"
              min={0}
              max={1000}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Product Grid */}
      <Grid container spacing={3}>
        {products.map((product: Product) => (
          <Grid
            item
            key={product.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            component={"div" as React.ElementType}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
              onClick={() => handleProductClick(product.id)}
            >
              <CardMedia
                component="img"
                height="200"
                image={
                  product.imageUrl ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" noWrap>
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                  noWrap
                >
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${product.price.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Seller: {product.seller.username}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {data && filters.page && products.length / filters.page > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={products.length / filters.page}
            page={filters.page ? filters.page + 1 : 1}
            onChange={(_, value) => handlePageChange(value)}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default ProductList;
