import { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import {
  signup as performSignup,
  login as performLogin,
} from '@/services/todoApi';

const Context = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token != null) setToken(token);
  }, []);

  const signup = useMutation({
    mutationFn: performSignup,
    onSuccess() {
      router.push('/login');
    },
  });

  const login = useMutation({
    mutationFn: performLogin,
    onSuccess({ data }) {
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      router.push('/');
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <Context.Provider value={{ signup, login, logout, token }}>
      {children}
    </Context.Provider>
  );
};

export const useAuth = () => {
  return useContext(Context);
};
