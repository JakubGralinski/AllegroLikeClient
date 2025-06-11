import React, { useEffect, useState } from "react";
import {
  Container,
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
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { Link } from "react-router-dom";
import { Product } from "../lib/types";
import productService from "../lib/product.service";
import { loadCategories, loadInventory } from "../store/products";
import categoryService from "../lib/category.service";
import { SERVER_URL } from "../lib/constants";
import cartService from "../lib/cart.service";
import { loadCart } from "../store/cartSlice";
import Notification from "./Notification";

const ProductPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("price-asc");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(
    null,
  );

  const [cartError, setCartError] = useState<string | null>(null);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null,
  );

  const cart = useSelector((state: RootState) => state.cart.userCart);
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

  function showNotification(message: string) {
    setNotificationMessage(message);
    setTimeout(() => setNotificationMessage(null), 2500);
  }

  async function handleAddToCartClick(product: Product) {
    if (cart) {
      const cartItem = cart.cartItems.find(
        (ci) => ci.product.id === product.id,
      );
      if (cartItem) {
        const cartRes = await cartService.updateCartItem(
          cartItem.id,
          cartItem.quantity + 1,
        );
        if (cartRes.isSuccess) {
          dispatch(loadCart(cartRes.content));
          setCartError(null);
          showNotification(
            "Increased product quantity, as it already is in your cart",
          );
        } else {
          setCartError(cartRes.errMessage);
        }
      } else {
        const cartRes = await cartService.addItemToCart(product.id, 1);
        if (cartRes.isSuccess) {
          dispatch(loadCart(cartRes.content));
          setCartError(null);
          showNotification("Added product to your cart");
        } else {
          setCartError(cartRes.errMessage);
        }
      }
    }
  }

  useEffect(() => {
    async function fetchCart(): Promise<void> {
      setIsLoading(true);

      try {
        const cartRes = await cartService.getCart();
        if (cartRes.isSuccess) {
          dispatch(loadCart(cartRes.content));
          setCartError(null);
        } else {
          setCartError(cartRes.errMessage);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (!cart) {
      fetchCart();
    }
  }, [cart, dispatch]);

  useEffect(() => {
    async function fetchProducts(): Promise<void> {
      setIsLoading(true);

      try {
        const productsRes = await productService.getAllProducts();
        if (productsRes.isSuccess) {
          dispatch(loadInventory(productsRes.content));
          setProductsError(null);
        } else {
          setProductsError(productsRes.errMessage);
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
          setCategoriesError(null);
        } else {
          setCategoriesError(categoriesRes.errMessage);
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

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-center font-extrabold text-3xl">
        Loading...
      </div>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Search and Filter Header - Centered across full screen width */}
      <Box sx={{ 
        mb: 4, 
        mt: 4,
        display: 'flex', 
        justifyContent: 'center',
        width: '100%'
      }}>
        <Container maxWidth="md">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <Box sx={{ flex: 2 }}>
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
            </Box>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1}>
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
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          {/* Filters Section - On the left */}
          {showFilters && (
            <Box sx={{ width: { xs: '100%', md: '300px' }, flexShrink: 0 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Filters
                </Typography>
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category"
                      onChange={handleCategoryChange}
                    >
                      <MenuItem value="All">All Categories</MenuItem>
                      {categories?.map((category) => (
                        <MenuItem key={category.id} value={category.name}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box>
                    <Typography gutterBottom>Price Range</Typography>
                    <Slider
                      value={priceRange}
                      onChange={handlePriceRangeChange}
                      valueLabelDisplay="auto"
                      min={0}
                      max={2000}
                    />
                  </Box>
                </Stack>
              </Paper>
            </Box>
          )}

          {/* Products Layout - Takes up the remaining space */}
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 2,
              }}
            >
              {filteredProducts?.map((product) => (
                <Card
                  key={product.id}
                  sx={{
                    height: "100%",
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Link
                    to={`/products/${product.id}`}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}
                  >
                    <Box sx={{ 
                      height: 200, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      p: 1,
                      backgroundColor: '#f5f5f5'
                    }}>
                      <CardMedia
                        component="img"
                        image={`${SERVER_URL}/${product.imageUrl}`}
                        alt={product.name}
                        sx={{
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography gutterBottom variant="h6" component="h2">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.category.name}
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Typography variant="h5" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                        ${product.price.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Link>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => handleAddToCartClick(product)}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        </Stack>
      </Container>

      {isAdmin && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            component={Link}
            to="/createProduct"
            variant="contained"
            color="primary"
          >
            Create New Product
          </Button>
        </Box>
      )}

      {(cartError || productsError || categoriesError) && (
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Stack spacing={2}>
            {cartError && (
              <Notification message={cartError} />
            )}
            {productsError && (
              <Notification message={productsError} />
            )}
            {categoriesError && (
              <Notification message={categoriesError} />
            )}
          </Stack>
        </Container>
      )}
      {notificationMessage && <Notification message={notificationMessage} />}
    </Box>
  );
};

export default ProductPage;
