import React from 'react';
import Head from 'next/head';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AuthProvider } from '@/context/AuthContext';

import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: `
              a {
                color: inherit;
                text-decoration: none;
              }            
            `,
          },
        },
      }),
    [prefersDarkMode]
  );
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer limit={1} />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}
