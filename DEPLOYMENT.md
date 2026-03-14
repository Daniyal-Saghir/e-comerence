# Deployment Guide

This project is configured for seamless deployment to platforms like Heroku, Render, or Vercel (monorepo style).

## Environment Variables

Ensure the following variables are set in your production environment:

### Backend
- `PORT`: (Default: 5000)
- `NODE_ENV`: Set to `production`
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for token signing
- `FIREBASE_SERVICE_ACCOUNT`: Your Firebase Admin SDK JSON configuration

### Frontend
- `VITE_API_URL`: The URL of your deployed backend API
- `VITE_FIREBASE_*`: Your Firebase client configuration

## Deployment Steps (Git-based)

1. **Build & Prepare**:
   The project is configured with a root `build` script.
   ```bash
   npm run build
   ```
   This will build the frontend and place it in `frontend/dist`.

2. **Server Context**:
   In production (`NODE_ENV=production`), the backend server automatically serves the frontend static files from `frontend/dist`.

3. **Start**:
   The root `package.json` includes a `start` script that activates the backend server:
   ```bash
   npm start
   ```

## Local Production Testing

To test the production flow locally:
1. Set `NODE_ENV=production` in your environment.
2. Run `npm run build`.
3. Run `npm start`.
4. Access the app at `http://localhost:5000`.
