// src/axiosConfig.js
import axios from 'axios';

const axiosConfig = axios.create({
    baseURL: 'http://localhost:8000/api', // Altere para a URL da sua API Laravel
    timeout: 10000, // Tempo limite de 10 segundos
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptores podem ser adicionados aqui, se necessário
axiosConfig.interceptors.request.use(
    (config) => {
        // Adicione qualquer lógica antes da solicitação ser enviada
        return config;
    },
    (error) => {
        // Lide com o erro
        return Promise.reject(error);
    }
);

axiosConfig.interceptors.response.use(
    (response) => {
        // Qualquer lógica para a resposta
        return response;
    },
    (error) => {
        // Lide com o erro de resposta
        return Promise.reject(error);
    }
);

export default axiosConfig;
