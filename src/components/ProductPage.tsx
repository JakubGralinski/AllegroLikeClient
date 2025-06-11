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
  useTheme as useMuiTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, CartItem } from "../store/cartSlice";
import { useTheme } from "../context/ThemeContext";
import { AppDispatch, RootState } from "../store";
import { Link } from "react-router-dom";

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

  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "ROLE_ADMIN";
  const dispatch = useDispatch<AppDispatch>();
  
  // Theme context
  const { theme: appTheme } = useTheme();
  const muiTheme = useMuiTheme();

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
    dispatch(addItemToCart({ ...product, quantity: 1 }));
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: appTheme === 'dark' ? muiTheme.palette.grey[800] : 'white',
                  color: appTheme === 'dark' ? 'white' : 'inherit',
                  '& fieldset': {
                    borderColor: appTheme === 'dark' ? muiTheme.palette.grey[600] : muiTheme.palette.grey[300],
                  },
                  '&:hover fieldset': {
                    borderColor: appTheme === 'dark' ? muiTheme.palette.grey[500] : muiTheme.palette.grey[400],
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: muiTheme.palette.primary.main,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: appTheme === 'dark' ? muiTheme.palette.grey[400] : 'inherit',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: appTheme === 'dark' ? muiTheme.palette.grey[500] : muiTheme.palette.grey[600],
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: appTheme === 'dark' ? muiTheme.palette.grey[400] : 'inherit' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4} component={"div" as React.ElementType}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: appTheme === 'dark' ? muiTheme.palette.grey[400] : 'inherit' }}>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort By"
                  sx={{
                    backgroundColor: appTheme === 'dark' ? muiTheme.palette.grey[800] : 'white',
                    color: appTheme === 'dark' ? 'white' : 'inherit',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: appTheme === 'dark' ? muiTheme.palette.grey[600] : muiTheme.palette.grey[300],
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: appTheme === 'dark' ? muiTheme.palette.grey[500] : muiTheme.palette.grey[400],
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: muiTheme.palette.primary.main,
                    },
                    '& .MuiSvgIcon-root': {
                      color: appTheme === 'dark' ? muiTheme.palette.grey[400] : 'inherit',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: appTheme === 'dark' ? muiTheme.palette.grey[800] : 'white',
                        color: appTheme === 'dark' ? 'white' : 'inherit',
                      },
                    },
                  }}
                >
                  <MenuItem value="date">Newest</MenuItem>
                  <MenuItem value="price-asc">Price: Low to High</MenuItem>
                  <MenuItem value="price-desc">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
              <IconButton 
                onClick={() => setShowFilters(!showFilters)}
                sx={{ 
                  color: appTheme === 'dark' ? muiTheme.palette.grey[400] : 'inherit',
                  backgroundColor: appTheme === 'dark' ? muiTheme.palette.grey[800] : 'transparent',
                  '&:hover': {
                    backgroundColor: appTheme === 'dark' ? muiTheme.palette.grey[700] : muiTheme.palette.grey[100],
                  },
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Filters Panel */}
      {showFilters && (
        <Paper sx={{ 
          p: 2, 
          mb: 4,
          backgroundColor: appTheme === 'dark' ? muiTheme.palette.grey[800] : muiTheme.palette.background.paper,
          color: appTheme === 'dark' ? 'white' : 'inherit',
        }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} component={"div" as React.ElementType}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: appTheme === 'dark' ? muiTheme.palette.grey[400] : 'inherit' }}>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="Category"
                  sx={{
                    backgroundColor: appTheme === 'dark' ? muiTheme.palette.grey[700] : 'white',
                    color: appTheme === 'dark' ? 'white' : 'inherit',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: appTheme === 'dark' ? muiTheme.palette.grey[600] : muiTheme.palette.grey[300],
                    },
                    '& .MuiSvgIcon-root': {
                      color: appTheme === 'dark' ? muiTheme.palette.grey[400] : 'inherit',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: appTheme === 'dark' ? muiTheme.palette.grey[800] : 'white',
                        color: appTheme === 'dark' ? 'white' : 'inherit',
                      },
                    },
                  }}
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
                <InputLabel sx={{ color: appTheme === 'dark' ? muiTheme.palette.grey[400] : 'inherit' }}>Condition</InputLabel>
                <Select
                  value={selectedCondition}
                  onChange={handleConditionChange}
                  label="Condition"
                  sx={{
                    backgroundColor: appTheme === 'dark' ? muiTheme.palette.grey[700] : 'white',
                    color: appTheme === 'dark' ? 'white' : 'inherit',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: appTheme === 'dark' ? muiTheme.palette.grey[600] : muiTheme.palette.grey[300],
                    },
                    '& .MuiSvgIcon-root': {
                      color: appTheme === 'dark' ? muiTheme.palette.grey[400] : 'inherit',
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: appTheme === 'dark' ? muiTheme.palette.grey[800] : 'white',
                        color: appTheme === 'dark' ? 'white' : 'inherit',
                      },
                    },
                  }}
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
              <Typography gutterBottom sx={{ color: appTheme === 'dark' ? 'white' : 'inherit' }}>
                Price Range
              </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={2000}
                step={50}
                sx={{
                  color: muiTheme.palette.primary.main,
                  '& .MuiSlider-thumb': {
                    backgroundColor: muiTheme.palette.primary.main,
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: muiTheme.palette.primary.main,
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: appTheme === 'dark' ? muiTheme.palette.grey[600] : muiTheme.palette.grey[300],
                  },
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: appTheme === 'dark' ? muiTheme.palette.grey[400] : 'inherit' }}>
                  ${priceRange[0]}
                </Typography>
                <Typography variant="body2" sx={{ color: appTheme === 'dark' ? muiTheme.palette.grey[400] : 'inherit' }}>
                  ${priceRange[1]}
                </Typography>
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
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                backgroundColor: appTheme === 'dark' ? muiTheme.palette.grey[800] : muiTheme.palette.background.paper,
                color: appTheme === 'dark' ? 'white' : 'inherit',
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: appTheme === 'dark' ? `0 8px 32px rgba(255, 255, 255, 0.1)` : 6,
                },
              }}
            >
              <CardMedia
                component="img"
                image={product.image}
                alt={product.title}
                sx={{
                  objectFit: "cover",
                  aspectRatio: "16/9",
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
                  sx={{ 
                    fontWeight: "medium", 
                    mb: 1,
                    color: appTheme === 'dark' ? 'white' : 'inherit',
                  }}
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
                  sx={{ 
                    mt: "auto",
                    color: appTheme === 'dark' ? muiTheme.palette.grey[400] : 'text.secondary',
                  }}
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
      {isAdmin && (
        <Link
          to={"/createProduct"}
          className="p-3 bg-primary font-semibold rounded-lg text-white mt-10 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-md"
        >
          Create new product
        </Link>
      )}
    </Container>
  );
};

export default ProductPage;
