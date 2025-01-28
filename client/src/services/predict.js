import api from './api';

export const predictDifficulty = async (gameStats) => {
    try {
        const response = await api.post('/predict', {
            edad_jugador: gameStats.edad_jugador,
            tiempo_cruce: gameStats.tiempo_cruce,
            velocidad_vehiculos: gameStats.velocidad_vehiculos,
            num_carriles: gameStats.num_carriles,
            num_intentos: gameStats.num_intentos
        });

        if (response.data.success) {
            return {
                difficulty: response.data.difficulty,
                success: true
            };
        } else {
            throw new Error(response.data.error || 'Failed to predict difficulty');
        }
    } catch (error) {
        console.error('Error predicting difficulty:', error);
        return {
            difficulty: 1, // Default difficulty
            success: false,
            error: error.message
        };
    }
};