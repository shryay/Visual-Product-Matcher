# Flask Image Similarity API - Docker

## Build Docker Image

```bash
docker build -t flask-image-similarity .
```

## Run with Docker

```bash
docker run -p 8081:8081 --env-file .env flask-image-similarity
```

## Run with Docker Compose

```bash
docker-compose up -d
```

## Stop Container

```bash
docker-compose down
```

## View Logs

```bash
docker-compose logs -f
```

## Environment Variables

Make sure your `.env` file contains:
- DATABASE_URL
- SUPABASE_URL
- SUPABASE_SERVICE_KEY
- SUPABASE_BUCKET

## API Endpoints

- Health: `http://localhost:8081/api/health`
- Search: `http://localhost:8081/api/search`
