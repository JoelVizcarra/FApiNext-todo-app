# FApiNext-todo-app

Simple FastApi - NextJS todo app

## Installation

Build services

```bash
  docker-compose up -d --build
```

Copy and rename the .env.example files to .env (for /backend and /frontend)

Run migrations

```bash
  docker exec -it todo-app-backend sh -c "cd /app && alembic upgrade head"
```

- Backend Docs URL http://localhost:9000/docs
- Frontend URL http://localhost:3000/signup
