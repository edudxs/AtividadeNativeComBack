import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.5:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});
