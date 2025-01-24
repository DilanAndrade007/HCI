import api from './api';

export const predictDifficulty = async (data) => {
    try {
        const response = await api.post('/predict', data);
        return response.data; // Returns the server's response (e.g., { dificultad: 6.5 })
    } catch (error) {
        console.error('Error predicting difficulty:', error);
        throw error; // Handle this error in your component
    }
};