import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import Avatar from '@mui/material/Avatar';
import Link from 'next/link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import AuthLayout from '@/layouts/AuthLayout';

import FormInput from '@/components/FormInput';
import { useAuth } from '@/context/AuthContext';

const loginSchema = object({
  username: string()
    .min(1, 'Username is required')
    .email('Username should be an email'),
  password: string().min(1, 'Password is required').max(100),
});

const Login = () => {
  const {
    login: { mutate: loginUser, isLoading, error, isError },
  } = useAuth();
  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isError) {
      const message =
        typeof error?.response?.data?.detail === 'string'
          ? error?.response?.data?.detail
          : 'An unexpected error ocurred';
      toast.error(message, {
        position: 'top-right',
      });
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmitHandler = (values) => {
    loginUser(values);
  };

  return (
    <React.Fragment>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Log in
      </Typography>
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          noValidate
          sx={{ mt: 1 }}
        >
          <FormInput name="username" label="Username" type="email" />
          <FormInput name="password" label="Password" type="password" />
          <LoadingButton
            variant="contained"
            sx={{ mt: 1 }}
            fullWidth
            disableElevation
            type="submit"
            loading={isLoading}
          >
            Log In
          </LoadingButton>
          <Typography textAlign="center" sx={{ mt: 1 }}>
            <Link href="/signup">Don't have an account? Sign Up</Link>
          </Typography>
        </Box>
      </FormProvider>
    </React.Fragment>
  );
};

Login.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Login;
