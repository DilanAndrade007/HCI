from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the model and scaler
model = joblib.load('modelo_juego_cruce_calle.pkl')
scaler = joblib.load('mmscaler_juego_cruce_calle.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Extract features in the correct order
        features = np.array([[
            data['edad_jugador'],
            data['tiempo_cruce'],
            data['velocidad_vehiculos'],
            data['num_carriles'],
            data['num_intentos']
        ]])
        
        # Scale the features
        scaled_features = scaler.transform(features)
        
        # Make prediction
        difficulty = float(model.predict(scaled_features)[0])
        
        return jsonify({
            'success': True,
            'difficulty': difficulty
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)