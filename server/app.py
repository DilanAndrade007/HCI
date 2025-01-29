from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the model and scaler
model = joblib.load('modelo_juego_cruce_calle.pkl')
scaler = joblib.load('mmscaler_juego_cruce_calle.pkl')
@app.route('/controller', methods=['POST', 'GET'])
def controller():
    try:
        if request.method == 'POST':
            data = request.json
            # Almacenar la última dirección recibida
            app.last_direction = data.get('direction', 'none')
            return jsonify({
                'success': True,
                'direction': data['direction']
            })
        else:
            # GET: Devolver la última dirección almacenada
            direction = getattr(app, 'last_direction', 'none')
            app.last_direction = 'none'  # Reset después de leer
            return jsonify({
                'success': True,
                'direction': direction
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    
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
    app.run(host='0.0.0.0', debug=True, port=5000)