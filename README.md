# Forest BD Viewer – Fullstack App

## Stack

Frontend:
- Next.js
- TypeScript
- Mapbox GL JS

Backend:
- Node.js
- TypeScript
- Express
- Apollo GraphQL
- TypeORM
- PostgreSQL + PostGIS

## Features

- User authentication (register / login)
- Interactive map with Mapbox
- Dynamic loading of BD Forêt data based on map bounds
- PostGIS spatial queries
- User map state persistence

## Requirements

- Docker & Docker Compose
- Mapbox access token

## Environment Variables

Frontend:
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql (optional override)

Backend (optional overrides for local runs):
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=forest

## Run with Docker
docker-compose up --build

Frontend: http://localhost:3000  
Backend (GraphQL): http://localhost:4000/graphql  

## Run Locally

### Backend

cd backend
npm install
npm run dev

### Frontend

cd frontend
npm install
npm run dev

## Database

PostgreSQL with PostGIS enabled.

Forest data must be stored as `MultiPolygon` geometry in SRID 4326.
You can import the provided sample (`data/masque_foret1.gpkg`) with:

```
ogr2ogr -f "PostgreSQL" PG:"host=localhost port=5432 dbname=forest user=postgres password=postgres" data/masque_foret1.gpkg -nln forest -nlt MULTIPOLYGON
```

## Notes

- Only a subset of BD Forêt data is required for prototyping
- Architecture is scalable to full dataset
- Bonus features intentionally excluded
