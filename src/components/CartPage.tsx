import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
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
  Paper,
  Divider,
  useTheme as useMuiTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { loadCart } from "../store/cartSlice";
import cartService from "../lib/cart.service";
import AddressInputPopup from "./AddressInputPopup";
import orderService from "../lib/order.service";
import { resetOrders } from "../store/orders";

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme: appTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();

  const cart = useSelector((state: RootState) => state.cart.userCart);
  const user = useSelector((state: RootState) => state.auth.user);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddressInputPopupOpen, setIsAddressInputPopupOpen] =
    useState<boolean>(false);

  const handleRemoveItem = async (itemId: number) => {
    const cartRes = await cartService.removeCartItem(itemId);
    if (cartRes.isSuccess) {
      dispatch(loadCart(cartRes.content));
      setError(null);
    } else {
      setError(cartRes.errMessage);
    }
  };

  const handleQuantityChange = async (itemId: number, quantity: number) => {
    if (quantity > 0) {
      const cartRes = await cartService.updateCartItem(itemId, quantity);
      if (cartRes.isSuccess) {
        dispatch(loadCart(cartRes.content));
        setError(null);
      } else {
        setError(cartRes.errMessage);
      }
    } else if (quantity === 0) {
      handleRemoveItem(itemId);
    } else {
      setError("Quantity can not be negative");
    }
  };

  const handleClearCart = async () => {
    const cartRes = await cartService.clearCart();
    if (cartRes.isSuccess) {
      dispatch(loadCart(cartRes.content));
      setError(null);
    } else {
      setError(cartRes.errMessage);
    }
  };

  const reloadCart = async () => {
    setIsLoading(true);

    try {
      const cartRes = await cartService.getCart();
      if (cartRes.isSuccess) {
        dispatch(loadCart(cartRes.content));
        setError(null);
      } else {
        setError(cartRes.errMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrderClick = async () => {
    if (!user?.address) {
      setError(
        "Your address data was needed, please try again after filling it",
      );
      setIsAddressInputPopupOpen(true);
      return;
    }

    const orderRes = await orderService.createOrderFromUserCart(user.id, null);
    if (orderRes.isSuccess) {
      setError(null);
      await reloadCart();
      dispatch(resetOrders());
      navigate("/orders");
    } else {
      setError(orderRes.errMessage);
    }
  };

  const calculateSubtotal = () => {
    return cart?.cartItems
      .reduce((acc, item) => acc + item.product.price * item.quantity, 0)
      .toFixed(2);
  };

  useEffect(() => {
    async function fetchCart(): Promise<void> {
      setIsLoading(true);

      try {
        const cartRes = await cartService.getCart();
        if (cartRes.isSuccess) {
          dispatch(loadCart(cartRes.content));
          setError(null);
        } else {
          setError(cartRes.errMessage);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (!cart) {
      fetchCart();
    }
  }, [cart, dispatch]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-center font-extrabold text-3xl">
        Loading...
      </div>
    );
  }

  if (cart?.cartItems.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: appTheme === "dark" ? "white" : "text.primary" }}
        >
          Your cart is empty.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          mb: 3,
          color: appTheme === "dark" ? "white" : "text.primary",
        }}
      >
        Shopping Cart
      </Typography>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          backgroundColor:
            appTheme === "dark"
              ? muiTheme.palette.grey[900]
              : muiTheme.palette.background.paper,
        }}
      >
        <List>
          {cart?.cartItems.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem
                sx={{
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <ListItemAvatar sx={{ mr: 0 }}>
                  <Avatar
                    variant="rounded"
                    src={
                      item.product.imageUrl || "https://via.placeholder.com/60"
                    }
                    alt={item.product.name}
                    sx={{ width: 60, height: 60 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.product.name}
                  secondary={`$${item.product.price.toFixed(2)}`}
                  primaryTypographyProps={{
                    sx: {
                      color: appTheme === "dark" ? "white" : "text.primary",
                      fontWeight: "medium",
                    },
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      color:
                        appTheme === "dark"
                          ? muiTheme.palette.grey[400]
                          : "text.secondary",
                    },
                  }}
                  sx={{ flexGrow: 1, minWidth: "150px" }}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: "100px",
                  }}
                >
                  <IconButton
                    sx={{ color: appTheme === "dark" ? "white" : "inherit" }}
                    size="small"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    sx={{
                      minWidth: "30px",
                      textAlign: "center",
                      px: 1,
                      color: appTheme === "dark" ? "white" : "text.primary",
                      fontWeight: "medium",
                    }}
                  >
                    {item.quantity}
                  </Typography>
                  <IconButton
                    sx={{ color: appTheme === "dark" ? "white" : "inherit" }}
                    size="small"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    minWidth: "80px",
                    fontWeight: "bold",
                    textAlign: "right",
                    color: appTheme === "dark" ? "white" : "text.primary",
                  }}
                >
                  ${(item.product.price * item.quantity).toFixed(2)}
                </Typography>
                <IconButton
                  sx={{ color: appTheme === "dark" ? "white" : "inherit" }}
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              <Divider
                component="li"
                sx={{
                  borderColor:
                    appTheme === "dark"
                      ? muiTheme.palette.grey[700]
                      : "rgba(0, 0, 0, 0.12)",
                }}
              />
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontWeight: "bold",
              color: appTheme === "dark" ? "white" : "text.primary",
            }}
          >
            Subtotal: ${calculateSubtotal()}
          </Typography>
          <div className="flex flex-row-reverse items-center justify-center gap-5">
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => handleCreateOrderClick()}
            >
              Create Order
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={() => handleClearCart()}
            >
              CLEAR CART
            </Button>
          </div>
        </Box>
      </Paper>
      {error && (
        <div className="text-lg text-center font-semibold text-secondary mt-2">
          {error}
        </div>
      )}
      {isAddressInputPopupOpen && (
        <AddressInputPopup
          setIsAddressInputPopupOpen={setIsAddressInputPopupOpen}
        />
      )}
    </Container>
  );
};

export default CartPage;
