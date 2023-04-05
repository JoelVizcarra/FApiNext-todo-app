import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

const AuthLayout = ({ children }) => {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token != null) router.push('/');
  }, [token]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'action.hover',
          borderRadius: 3,
          p: 4,
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

export default AuthLayout;
