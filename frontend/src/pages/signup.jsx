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

const signupSchema = object({
  name: string().min(1, 'Name is required').max(100),
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  password: string().min(1, 'Password is required').max(100),
});

const Signup = () => {
  const {
    signup: { mutate: signupUser, isLoading, isSuccess, error, isError },
  } = useAuth();
  const methods = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSuccess) {
      toast.success('User registered successfully');
    }

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
    signupUser(values);
  };

  return (
    <React.Fragment>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <FormProvider {...methods}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmitHandler)}
          sx={{ mt: 3 }}
        >
          <FormInput name="name" label="Name" />
          <FormInput name="email" label="Email Address" type="email" />
          <FormInput name="password" label="Password" type="password" />
          <LoadingButton
            variant="contained"
            sx={{ mt: 1 }}
            fullWidth
            disableElevation
            type="submit"
            loading={isLoading}
          >
            Sign Up
          </LoadingButton>
          <Typography textAlign="center" sx={{ mt: 1 }}>
            <Link href="/login">Already have an account? Log in</Link>
          </Typography>
        </Box>
      </FormProvider>
    </React.Fragment>
  );
};

Signup.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Signup;
