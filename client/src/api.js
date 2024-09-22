import axios from 'axios';

const api = axios.create({
    baseURL:`${process.env.REACT_APP_BACKEND_SERVER_URL}/auth`
});
export const googleAuth = (code) => api.get(`/google?code=${code}`);