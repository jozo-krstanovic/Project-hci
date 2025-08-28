
import axios from "axios";

/**
 * The base URL for the API, retrieved from environment variables.
 * Defaults to http://localhost:3001 if not set.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * The main Axios instance for making API requests.
 */
export const api = axios.create({
  baseURL: API_URL,
});

/**
 * Logs in a user.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns The response from the server.
 */
export const login = (email: string, password: string) => {
  return api.post("/api/login", { username: email, password });
};

// You can add other API functions here, for example:
/*
export const getWorkouts = () => {
  return api.get("/api/workouts");
};

export const register = (email: string, password: string) => {
  return api.post("/api/register", { username: email, password });
};
*/
