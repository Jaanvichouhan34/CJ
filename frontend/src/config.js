// In development (local), calls go to localhost:5000
// In production (Vercel build), VITE_API_URL env var points to Render
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export default BASE_URL;
