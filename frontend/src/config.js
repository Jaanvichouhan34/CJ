// In development (local), calls go to localhost:5005
// In production (Vercel build), VITE_API_URL env var points to Render
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
export default BASE_URL;
