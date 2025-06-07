import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  useTheme as useMuiTheme,
} from "@mui/material";
import { useAuth } from "./AuthContext";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

interface RegisterFormInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = React.useState<string>("");
  const paperRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const { theme: appTheme } = useTheme();
  const muiTheme = useMuiTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    if (paperRef.current) {
      gsap.fromTo(
        paperRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, []);
  
  // Button hover animation
  React.useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    const handleMouseEnter = () => {
      gsap.to(btn, { scale: 1.05, duration: 0.2, ease: "power1.out" });
    };
    const handleMouseLeave = () => {
      gsap.to(btn, { scale: 1, duration: 0.2, ease: "power1.out" });
    };
    btn.addEventListener("mouseenter", handleMouseEnter);
    btn.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      btn.removeEventListener("mouseenter", handleMouseEnter);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await registerUser(data.username, data.email, data.password);
      navigate("/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  // Shake button if validation errors on submit
  const handleInvalid = async () => {
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { x: -10 },
        {
          x: 10,
          duration: 0.1,
          yoyo: true,
          repeat: 5,
          ease: "power1.inOut",
          onComplete: () => {
            gsap.to(buttonRef.current, { x: 0, duration: 0.1 });
          },
        }
      );
    }
  };

  const isDarkMode = appTheme === 'dark';

  return (
    <>
      <Container 
        component="main" 
        maxWidth="xs" 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: 'calc(100vh - 64px)', // Assuming 64px navbar height
          backgroundColor: isDarkMode ? '#1a202c' : '#f7fafc', // Dark blue-grey for dark mode
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: '100%',
          }}
        >
          <Paper
            ref={paperRef}
            elevation={isDarkMode ? 5 : 3}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              backgroundColor: isDarkMode ? '#2d3748' : muiTheme.palette.background.paper,
              color: isDarkMode ? '#fff' : 'inherit',
            }}
          >
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                {error}
              </Alert>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit, handleInvalid)}
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                autoComplete="username"
                autoFocus
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
                InputLabelProps={{
                  style: { color: isDarkMode ? '#a0aec0' : 'inherit' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#4a5568' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#718096' : 'rgba(0, 0, 0, 0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? muiTheme.palette.primary.main : muiTheme.palette.primary.main,
                    },
                    color: isDarkMode ? '#fff' : 'inherit',
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputLabelProps={{
                  style: { color: isDarkMode ? '#a0aec0' : 'inherit' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#4a5568' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#718096' : 'rgba(0, 0, 0, 0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: muiTheme.palette.primary.main,
                    },
                    color: isDarkMode ? '#fff' : 'inherit',
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputLabelProps={{
                  style: { color: isDarkMode ? '#a0aec0' : 'inherit' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#4a5568' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#718096' : 'rgba(0, 0, 0, 0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: muiTheme.palette.primary.main,
                    },
                    color: isDarkMode ? '#fff' : 'inherit',
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputLabelProps={{
                  style: { color: isDarkMode ? '#a0aec0' : 'inherit' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#4a5568' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#718096' : 'rgba(0, 0, 0, 0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: muiTheme.palette.primary.main,
                    },
                    color: isDarkMode ? '#fff' : 'inherit',
                  },
                }}
              />
              <Button
                ref={buttonRef}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  backgroundColor: isDarkMode ? '#3182ce' : muiTheme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#2b6cb0' : muiTheme.palette.primary.dark,
                  }
                }}
              >
                Register
              </Button>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Typography variant="body2" color={isDarkMode ? '#a0aec0' : 'text.secondary'}>
                  Already have an account?
                </Typography>
                <Button
                  variant="text"
                  onClick={() => navigate("/login")}
                  sx={{ 
                    textTransform: "none",
                    color: isDarkMode ? '#63b3ed' : muiTheme.palette.primary.main,
                  }}
                >
                  Login
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Register;
