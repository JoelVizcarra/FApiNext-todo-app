import React, { useEffect } from 'react';
import Container from '@mui/material/Container';

import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

const AppLayout = ({ children }) => {
  const { logout, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token == null) router.push('/login');
  }, [token]);

  return (
    <React.Fragment>
      <Navbar logout={logout} />
      <Container maxWidth="lg" component="main" sx={{ py: 3 }}>
        {children}
      </Container>
    </React.Fragment>
  );
};

export default AppLayout;
