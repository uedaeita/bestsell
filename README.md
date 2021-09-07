# BestSell

## Get Started

### Install Docker Desktop

https://docs.docker.com/desktop/

### Backend Setup

```bash
cp -ip ./backend/.env.dev ./backend/.env
```

### Start Services

```bash
docker compose up
```

### Database Setup

```bash
./bestsell backend
make migrate
make seed
```

### Update Categories

1. Access http://localhost/bestsell/api/docs#/categories/update_categories_categories__post

2. Click on `Try it out` button

3. Click on `Execute` button

## Web Access

|Type    |URL                               |
|:-------|:---------------------------------|
|Service |http://localhost/bestsell         |
|API Docs|http://localhost/bestsell/api/docs|

## Development

### Docker Container Access

```bash
# Access backend server
./bestsell backend

# Access frontend server
./bestsell frontend

# Access PostgreSQL database
./bestsell db
```
