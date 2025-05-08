import React, { useState, useRef } from 'react';
import { Badge, IconButton, Popover, Box, Typography, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../store/CartContext';
import { useNavigate } from 'react-router-dom';

const CartMenu: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [iconHovered, setIconHovered] = useState(false);
  const [popoverHovered, setPopoverHovered] = useState(false);
  const navigate = useNavigate();
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const handleIconEnter = (event: React.MouseEvent<HTMLElement>) => {
    setIconHovered(true);
    setAnchorEl(event.currentTarget);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const handleIconLeave = () => {
    setIconHovered(false);
    closeTimer.current = setTimeout(() => {
      if (!popoverHovered) setAnchorEl(null);
    }, 100);
  };
  const handlePopoverEnter = () => {
    setPopoverHovered(true);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const handlePopoverLeave = () => {
    setPopoverHovered(false);
    closeTimer.current = setTimeout(() => {
      if (!iconHovered) setAnchorEl(null);
    }, 100);
  };
  const handleGoToCart = () => {
    setAnchorEl(null);
    navigate('/cart');
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <IconButton
        color="inherit"
        onMouseEnter={handleIconEnter}
        onMouseLeave={handleIconLeave}
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
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          onMouseEnter: handlePopoverEnter,
          onMouseLeave: handlePopoverLeave,
          sx: { minWidth: 300 },
        }}
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
              <Button fullWidth variant="contained" color="primary" onClick={handleGoToCart}>
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