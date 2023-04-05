import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const AuthLayout = ({ children }) => {
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
