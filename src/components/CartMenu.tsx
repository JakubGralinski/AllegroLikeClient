import React, { useState } from 'react';
import { Badge, IconButton, Popover, Box, Typography, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../store/CartContext';
import { useNavigate } from 'react-router-dom';

const CartMenu: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleIconEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleIconLeave = () => {
    setAnchorEl(null);
  };
  const handleClick = () => {
    setAnchorEl(null);
    navigate('/cart');
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <IconButton
        color="inherit"
        onMouseEnter={handleIconEnter}
        onMouseLeave={handleIconLeave}
        onClick={handleClick}
        size="large"
        sx={{ ml: 2 }}
      >
        <Badge badgeContent={cartItems.length} color="secondary">
          <ShoppingCartIcon fontSize="large" />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleIconLeave}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ onMouseEnter: handleIconEnter, onMouseLeave: handleIconLeave, sx: { minWidth: 300 } }}
        disableRestoreFocus
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Cart</Typography>
          <Divider sx={{ mb: 1 }} />
          {cartItems.length === 0 ? (
            <Typography variant="body2">Your cart is empty.</Typography>
          ) : (
            <List dense>
              {cartItems.map((item) => (
                <ListItem key={item.id} secondaryAction={
                  <Button size="small" color="error" onClick={() => removeFromCart(item.id)}>Remove</Button>
                }>
                  <ListItemText
                    primary={item.title}
                    secondary={`$${item.price}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
          {cartItems.length > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              <Button fullWidth variant="contained" color="primary" onClick={handleClick}>
                Go to Cart
              </Button>
              <Button fullWidth variant="text" color="secondary" onClick={clearCart} sx={{ mt: 1 }}>
                Clear Cart
              </Button>
            </>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default CartMenu; 