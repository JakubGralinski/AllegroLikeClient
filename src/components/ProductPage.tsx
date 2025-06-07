import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, CartItem } from "../store/cartSlice";
import { AppDispatch, RootState } from "../store";
import { Link } from "react-router-dom";
import { Product } from "../lib/types";
import productService from "../lib/product.service";
import { loadCategories, loadInventory } from "../store/products";
import categoryService from "../lib/category.service";
import { SERVER_URL } from "../lib/constants";

const ProductPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("price-asc");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(
    null,
  );

  const user = useSelector((state: RootState) => state.auth.user);
  const products = useSelector((state: RootState) => state.products.inventory);
  const categories = useSelector(
    (state: RootState) => state.products.categories,
  );
  const isAdmin = user?.role === "ROLE_ADMIN";
  const dispatch = useDispatch<AppDispatch>();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  const handlePriceRangeChange = (
    _event: Event,
    newValue: number | number[],
  ) => {
    setPriceRange(newValue as number[]);
  };

  useEffect(() => {
    async function fetchProducts(): Promise<void> {
      setIsLoading(true);

      try {
        const productsRes = await productService.getAllProducts();
        if (productsRes.isSuccess) {
          dispatch(loadInventory(productsRes.content));
          setError(null);
        } else {
          setError(productsRes.errMessage);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (!products) {
      fetchProducts();
    }
  }, [products, dispatch]);

  useEffect(() => {
    async function fetchCategories(): Promise<void> {
      setIsLoading(true);

      try {
        const categoriesRes = await categoryService.getAllCategories();
        if (categoriesRes.isSuccess) {
          dispatch(loadCategories(categoriesRes.content));
          setError(null);
        } else {
          setError(categoriesRes.errMessage);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (!categories) {
      fetchCategories();
    }
  }, [categories, dispatch]);

  useEffect(() => {
    // Filter and sort products
    if (products) {
      const currentlyFilteredProducts = products
        .filter((product) => {
          const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const matchesCategory =
            selectedCategory === "All" ||
            product.category.name === selectedCategory;
          const matchesPrice =
            product.price >= priceRange[0] && product.price <= priceRange[1];
          return matchesSearch && matchesCategory && matchesPrice;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case "price-asc":
              return a.price - b.price;
            case "price-desc":
              return b.price - a.price;
            default:
              return 0;
          }
        });
      setFilteredProducts(currentlyFilteredProducts);
    }
  }, [priceRange, searchQuery, products, selectedCategory, sortBy]);

  const handleAddToCart = (product: Omit<CartItem, "quantity">) => {
    dispatch(addItemToCart(product));
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-center font-extrabold text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, mb: 4 }}
      className="h-screen flex items-center justify-center flex-col"
    >
      {/* Search and Filter Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8} component={"div" as React.ElementType}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4} component={"div" as React.ElementType}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort By"
                >
                  <MenuItem value="price-asc">Price: Low to High</MenuItem>
                  <MenuItem value="price-desc">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
              <IconButton onClick={() => setShowFilters(!showFilters)}>
                <FilterListIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Filters Panel */}
      {showFilters && (
        <Paper sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} component={"div" as React.ElementType}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  {categories?.map((category) => (
                    <MenuItem key={category.name} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} component={"div" as React.ElementType}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={2000}
                step={50}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">${priceRange[0]}</Typography>
                <Typography variant="body2">${priceRange[1]}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Product Grid */}
      <Grid container spacing={3}>
        {filteredProducts?.map((product) => (
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
                transition:
                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 6, // Corresponds to theme.shadows[6]
                },
              }}
            >
              <CardMedia
                component="img"
                image={SERVER_URL + "/" + product.imageUrl}
                alt={product.name}
                sx={{
                  objectFit: "cover", // Ensures the image covers the area, might crop
                  height: 180,
                  width: "100%",
                }}
              />
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                }}
              >
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: "medium", mb: 1 }}
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="h5"
                  color="primary"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  ${product.price}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: "auto" }}
                >
                  {product.category.name}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={() =>
                    handleAddToCart({
                      id: product.id,
                      title: product.name,
                      price: product.price,
                      image: product.imageUrl,
                    })
                  }
                  sx={{ mt: 2, alignSelf: "center" }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {isAdmin && (
        <Link
          to={"/createProduct"}
          className="p-3 bg-primary font-semibold rounded-lg text-white mt-10 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md"
        >
          Create new product
        </Link>
      )}
      {error && (
        <div className="text-lg font-semibold text-secondary">{error}</div>
      )}
    </Container>
  );
};

export default ProductPage;
