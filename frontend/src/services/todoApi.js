import axios from 'axios';
import { toast } from 'react-toastify';
import Router from 'next/router';

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  timeout: 5000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token != null)
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      if (
        ['Not authenticated', 'Invalid JWT'].includes(
          error.response.data.detail
        )
      ) {
        localStorage.removeItem('token');
        toast.error('Your session has expired, please log in again', {
          position: 'top-right',
        });
        Router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

export const signup = (user) => instance.post(`/auth/signup`, user);
export const login = (credentials) => {
  const form = new FormData();
  form.append('username', credentials.username);
  form.append('password', credentials.password);

  return instance.post(`/auth/login`, form, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
  });
};

export const getTodos = () => instance.get(`/todos`);
export const getTodo = (todoId) => instance.get(`/todos/${todoId}`);
export const createTodo = (todo) => instance.post(`/todos`, todo);
export const updateTodo = ({ todoId, todo }) =>
  instance.put(`/todos/${todoId}`, todo);
export const deleteTodo = (todoId) => instance.delete(`/todos/${todoId}`);
