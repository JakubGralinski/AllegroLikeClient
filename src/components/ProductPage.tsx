import React, { useState } from "react";
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
import { useDispatch } from "react-redux";
import { addItemToCart, CartItem } from "../store/cartSlice";
import { AppDispatch } from "../store";

// Mock data for initial development
const mockProducts = [
  {
    id: 1,
    title: "iPhone 13 Pro",
    price: 999.99,
    image: "https://via.placeholder.com/200",
    category: "Electronics",
    condition: "New",
    date: "2024-03-15",
  },
  {
    id: 2,
    title: "MacBook Air M2",
    price: 1299.99,
    image: "https://via.placeholder.com/200",
    category: "Electronics",
    condition: "New",
    date: "2024-03-14",
  },
  // Add more mock products as needed
];

const categories = ["All", "Electronics", "Clothing", "Home", "Sports"];
const conditions = ["All", "New", "Used", "Refurbished"];

const ProductPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);
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

  const handleConditionChange = (event: any) => {
    setSelectedCondition(event.target.value);
  };

  const handlePriceRangeChange = (
    _event: Event,
    newValue: number | number[],
  ) => {
    setPriceRange(newValue as number[]);
  };

  // Filter and sort products
  const filteredProducts = mockProducts
    .filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesCondition =
        selectedCondition === "All" || product.condition === selectedCondition;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      return (
        matchesSearch && matchesCategory && matchesCondition && matchesPrice
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        default:
          return 0;
      }
    });

  const handleAddToCart = (product: Omit<CartItem, "quantity">) => {
    dispatch(addItemToCart(product));
  };

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
                  <MenuItem value="date">Newest</MenuItem>
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
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} component={"div" as React.ElementType}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={selectedCondition}
                  onChange={handleConditionChange}
                  label="Condition"
                >
                  {conditions.map((condition) => (
                    <MenuItem key={condition} value={condition}>
                      {condition}
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
        {filteredProducts.map((product) => (
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
                image={product.image}
                alt={product.title}
                sx={{
                  objectFit: "cover", // Ensures the image covers the area, might crop
                  aspectRatio: "16/9", // Responsive aspect ratio for better design
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
                  {product.title}
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
                  {product.category} • {product.condition}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={() =>
                    handleAddToCart({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      image: product.image,
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
    </Container>
  );
};

export default ProductPage;
