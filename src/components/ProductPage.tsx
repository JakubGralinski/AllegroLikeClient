import React, { useState } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../store/CartContext';
import CartMenu from './CartMenu';

// Mock data for initial development
const mockProducts = [
  {
    id: 1,
    title: 'iPhone 13 Pro',
    price: 999.99,
    image: 'https://via.placeholder.com/400',
    category: 'Electronics',
    condition: 'New',
    date: '2024-03-15',
  },
  {
    id: 2,
    title: 'MacBook Air M2',
    price: 1299.99,
    image: 'https://via.placeholder.com/400',
    category: 'Electronics',
    condition: 'New',
    date: '2024-03-14',
  },
  {
    id: 3,
    title: 'Nike Air Max',
    price: 129.99,
    image: 'https://via.placeholder.com/400',
    category: 'Sports',
    condition: 'New',
    date: '2024-03-13',
  },
  {
    id: 4,
    title: 'Samsung TV 55"',
    price: 799.99,
    image: 'https://via.placeholder.com/400',
    category: 'Electronics',
    condition: 'Used',
    date: '2024-03-12',
  },
  {
    id: 5,
    title: 'Leather Jacket',
    price: 199.99,
    image: 'https://via.placeholder.com/400',
    category: 'Clothing',
    condition: 'New',
    date: '2024-03-11',
  },
  {
    id: 6,
    title: 'Coffee Table',
    price: 149.99,
    image: 'https://via.placeholder.com/400',
    category: 'Home',
    condition: 'Refurbished',
    date: '2024-03-10',
  },
  {
    id: 7,
    title: 'PlayStation 5',
    price: 499.99,
    image: 'https://via.placeholder.com/400',
    category: 'Electronics',
    condition: 'New',
    date: '2024-03-09',
  },
  {
    id: 8,
    title: 'Running Shoes',
    price: 89.99,
    image: 'https://via.placeholder.com/400',
    category: 'Sports',
    condition: 'New',
    date: '2024-03-08',
  },
  {
    id: 9,
    title: 'Smart Watch',
    price: 299.99,
    image: 'https://via.placeholder.com/400',
    category: 'Electronics',
    condition: 'New',
    date: '2024-03-07',
  },
  {
    id: 10,
    title: 'Designer Backpack',
    price: 159.99,
    image: 'https://via.placeholder.com/400',
    category: 'Clothing',
    condition: 'New',
    date: '2024-03-06',
  },
  {
    id: 11,
    title: 'Gaming Chair',
    price: 249.99,
    image: 'https://via.placeholder.com/400',
    category: 'Home',
    condition: 'New',
    date: '2024-03-05',
  },
  {
    id: 12,
    title: 'Wireless Earbuds',
    price: 179.99,
    image: 'https://via.placeholder.com/400',
    category: 'Electronics',
    condition: 'New',
    date: '2024-03-04',
  },
];

const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Sports'];
const conditions = ['All', 'New', 'Used', 'Refurbished'];

const ProductPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  // Filter and sort products
  const filteredProducts = mockProducts
    .filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesCondition = selectedCondition === 'All' || product.condition === selectedCondition;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        default:
          return 0;
      }
    });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
        <CartMenu />
      </Box>
      {/* Search and Filter Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
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
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select value={sortBy} onChange={handleSortChange} label="Sort By">
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={selectedCategory} onChange={handleCategoryChange} label="Category">
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select value={selectedCondition} onChange={handleConditionChange} label="Condition">
                  {conditions.map((condition) => (
                    <MenuItem key={condition} value={condition}>
                      {condition}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={2000}
                step={50}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">${priceRange[0]}</Typography>
                <Typography variant="body2">${priceRange[1]}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Product Grid */}
      <Grid 
        container 
        spacing={4} 
        sx={{ maxWidth: 3 * 345 + 2 * 32, margin: '0 auto' }} // 345px card width + 32px spacing
      >
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6,
                },
                width: 345,
                margin: '0 auto',
                position: 'relative',
              }}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <CardMedia
                component="img"
                height="400"
                image={product.image}
                alt={product.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  {product.title}
                </Typography>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                  ${product.price}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {product.category} • {product.condition}
                </Typography>
              </CardContent>
              {hoveredId === product.id && (
                <Box sx={{
                  position: 'absolute',
                  bottom: 24,
                  right: 24,
                  zIndex: 2,
                }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductPage; 