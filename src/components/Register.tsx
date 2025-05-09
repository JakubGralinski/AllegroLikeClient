import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useAuth } from '../lib/AuthContext';
import gsap from 'gsap';

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
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
  const [error, setError] = React.useState<string>('');
  const paperRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

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
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }
  }, []);

  React.useEffect(() => {
    const wave1 = document.getElementById('wavePath1');
    const wave2 = document.getElementById('wavePath2');
    if (!wave1 || !wave2) return;

    gsap.to(wave1, {
      attr: {
        d: "M0,1200 C750,1500 2250,900 3000,1200 L3000,1600 L0,1600 Z"
      },
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to(wave2, {
      attr: {
        d: "M0,1400 C900,1700 1980,1100 3000,1400 L3000,1600 L0,1600 Z"
      },
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, []);

  // Button hover animation
  React.useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    const handleMouseEnter = () => {
      gsap.to(btn, { scale: 1.05, duration: 0.2, ease: 'power1.out' });
    };
    const handleMouseLeave = () => {
      gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power1.out' });
    };
    btn.addEventListener('mouseenter', handleMouseEnter);
    btn.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      btn.removeEventListener('mouseenter', handleMouseEnter);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await registerUser(data.username, data.email, data.password);
      navigate('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  // Shake button if validation errors on submit
  const handleInvalid = async () => {
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { x: -10 },
        { x: 10, duration: 0.1, yoyo: true, repeat: 5, ease: 'power1.inOut', onComplete: () => {
          gsap.to(buttonRef.current, { x: 0, duration: 0.1 });
        }}
      );
    }
  };

  return (
    <>
      <Box sx={{ position: 'fixed', inset: 0, zIndex: -1, width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <svg
          id="auth-bg-wave"
          width="100vw"
          height="100vh"
          viewBox="0 0 3000 1600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh' }}
        >
          <defs>
            <linearGradient id="waveGradient1" x1="0" y1="0" x2="3000" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2196f3" />
              <stop offset="1" stopColor="#9c27b0" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0" y1="0" x2="3000" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#42a5f5" />
              <stop offset="1" stopColor="#ce93d8" />
            </linearGradient>
          </defs>
          <path
            id="wavePath1"
            d="M0,1200 C750,1100 2250,1300 3000,1200 L3000,1600 L0,1600 Z"
            fill="url(#waveGradient1)"
            opacity="0.7"
          />
          <path
            id="wavePath2"
            d="M0,1400 C900,1300 1980,1500 3000,1400 L3000,1600 L0,1600 Z"
            fill="url(#waveGradient2)"
            opacity="0.5"
          />
        </svg>
      </Box>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            ref={paperRef}
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                {error}
              </Alert>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit, handleInvalid)}
              sx={{ mt: 1, width: '100%' }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                autoComplete="username"
                autoFocus
                {...register('username')}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
              <Button
                ref={buttonRef}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Register; 