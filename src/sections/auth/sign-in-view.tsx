import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import axios from 'axios';
import { Alert } from '@mui/material';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSignIn = async (formData: FormData) => {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
  
    console.log('username:', username);
    console.log('password:', password);
  
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });
    
      const { access } = response.data;
    
      if (access) {
        // Store token in localStorage
        localStorage.setItem('accessToken', access);
    
        // Fetch user information
        const userInfoResponse = await axios.get('http://localhost:8000/api/user-info/', {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        
        
        const userInfo = userInfoResponse.data;
        console.log('User Info:', userInfo);
        
        // Navigate based on user type
        if (userInfo.is_superuser) {
          router.push('/admin/dashboard');
        } else if (userInfo.utype === "2") {
          router.push('/'); // Default route
        }
      }
    } catch (error: any) {
      console.error('Login failed:', error.response?.data.detail || error.message);
      setFormError(error.response?.data.detail);
    }
  };

  const renderForm = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSignIn(new FormData(e.currentTarget));
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <TextField
          fullWidth
          autoComplete="username"
          name="username"
          label="Email address"
          sx={{ mb: 3 }}
        />
  
        <TextField
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
  
        <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
          Forgot password?
        </Link>
  
        <LoadingButton fullWidth size="large" type="submit" color="inherit" variant="contained">
          Sign in
        </LoadingButton>
      </Box>
    </form>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography>
      </Box>

      {formError && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setFormError(null)} hidden={!formError}>{formError}</Alert>}
      
      {renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box>
    </>
  );
}
