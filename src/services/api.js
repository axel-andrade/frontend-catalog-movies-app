import axios from 'axios';

const api = axios.create({
    baseURL: 'https://movie-catalog2020.herokuapp.com'
});

export default api;