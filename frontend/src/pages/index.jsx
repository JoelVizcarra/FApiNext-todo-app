import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';

import { useMutation, useQuery } from 'react-query';
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from '@/services/todoApi';
import AppLayout from '@/layouts/AppLayout';
import TodoItem from '@/components/TodoItem';
import FormInput from '@/components/FormInput';

const todoSchema = object({
  text: string().min(1, 'Text is required').max(100),
});

export default function Home() {
  const { data, refetch: refetchTodos } = useQuery('todos', getTodos);
  const { mutate: addTodo, isLoading } = useMutation({
    mutationFn: createTodo,
    onSuccess() {
      refetchTodos();
    },
  });
  const { mutate: editTodo } = useMutation({
    mutationFn: updateTodo,
    onSuccess() {
      refetchTodos();
    },
  });
  const { mutate: removeTodo } = useMutation({
    mutationFn: deleteTodo,
    onSuccess() {
      refetchTodos();
    },
  });

  const methods = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      text: '',
    },
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmitHandler = (values) => {
    addTodo({ ...values, completed: false });
  };

  const handleToggle = (e) => {
    const todoId = e.currentTarget.dataset.id;
    const todo = data.data.find(({ id }) => id == todoId);
    editTodo({ todoId, todo: { text: todo.text, completed: !todo.completed } });
  };
  const handleDelete = (e) => {
    removeTodo(e.currentTarget.dataset.id);
  };

  return (
    <Container maxWidth="xs">
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          noValidate
          sx={{ mt: 1 }}
        >
          <FormInput name="text" label="Todo" type="text" />
          <LoadingButton
            variant="contained"
            sx={{ mt: 1 }}
            fullWidth
            disableElevation
            type="submit"
            loading={isLoading}
          >
            Add Todo
          </LoadingButton>
        </Box>
      </FormProvider>
      {data ? (
        <List>
          {data?.data?.map((todo) => (
            <TodoItem
              {...todo}
              key={todo.id}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </List>
      ) : (
        <Typography sx={{ mt: 1 }}>Loading...</Typography>
      )}
    </Container>
  );
}

Home.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
