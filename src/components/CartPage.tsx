import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { CartItem, removeItemFromCart, updateItemQuantity } from '../store/cartSlice';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Button,
  Box,
  TextField,
  Paper,
  Divider,
  useTheme as useMuiTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const CartPage: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const { theme: appTheme } = useTheme();
  const muiTheme = useMuiTheme();

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeItemFromCart(itemId));
  };

  const handleQuantityChange = (itemId: number, quantity: number) => {
    if (quantity >= 0) {
      dispatch(updateItemQuantity({ id: itemId, quantity }));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  };

  if (cartItems.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom 
          sx={{ color: appTheme === 'dark' ? 'white' : 'text.primary' }}
        >
          Your cart is empty.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" color="primary">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
          mb: 3, 
          color: appTheme === 'dark' ? 'white' : 'text.primary' 
        }}>
        Shopping Cart
      </Typography>
      <Paper 
        elevation={3} 
        sx={{
          p: 3,
          backgroundColor: appTheme === 'dark' ? muiTheme.palette.grey[900] : muiTheme.palette.background.paper,
        }}
      >
        <List>
          {cartItems.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem sx={{ 
                  py: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: 2
                }}>
                <ListItemAvatar sx={{ mr: 0 }}>
                  <Avatar 
                    variant="rounded" 
                    src={item.image || 'https://via.placeholder.com/60'} 
                    alt={item.title} 
                    sx={{ width: 60, height: 60 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.title}
                  secondary={`$${item.price.toFixed(2)}`}
                  primaryTypographyProps={{ sx: { color: appTheme === 'dark' ? 'white' : 'text.primary', fontWeight: 'medium' } }}
                  secondaryTypographyProps={{ sx: { color: appTheme === 'dark' ? muiTheme.palette.grey[400] : 'text.secondary' } }}
                  sx={{ flexGrow: 1, minWidth: '150px'}}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '100px' }}>
                  <IconButton sx={{ color: appTheme === 'dark' ? 'white' : 'inherit' }} size="small" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{
                    minWidth: '30px',
                    textAlign: 'center',
                    px: 1,
                    color: appTheme === 'dark' ? 'white' : 'text.primary',
                    fontWeight: 'medium'
                  }}>
                    {item.quantity}
                  </Typography>
                  <IconButton sx={{ color: appTheme === 'dark' ? 'white' : 'inherit' }} size="small" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="subtitle1" sx={{ 
                    minWidth: '80px', 
                    fontWeight: 'bold', 
                    textAlign: 'right',
                    color: appTheme === 'dark' ? 'white' : 'text.primary' 
                  }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
                <IconButton sx={{ color: appTheme === 'dark' ? 'white' : 'inherit' }} edge="end" aria-label="delete" onClick={() => handleRemoveItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              <Divider component="li" sx={{ borderColor: appTheme === 'dark' ? muiTheme.palette.grey[700] : 'rgba(0, 0, 0, 0.12)' }} />
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Typography variant="h5" component="p" sx={{ 
              fontWeight: 'bold', 
              color: appTheme === 'dark' ? 'white' : 'text.primary' 
            }}>
            Subtotal: ${calculateSubtotal()}
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} component={RouterLink} to="/checkout">
            Proceed to Checkout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CartPage; 