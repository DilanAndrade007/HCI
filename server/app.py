from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import joblib
import numpy as np
import json
import time

app = Flask(__name__)
CORS(app)

# Load the model and scaler
model = joblib.load('modelo_juego_cruce_calle.pkl')
scaler = joblib.load('mmscaler_juego_cruce_calle.pkl')

# Variable global para almacenar la última dirección
app.last_direction = 'none'
app.last_update_time = 0



@app.route('/controller', methods=['POST', 'GET'])
def controller():
    try:
        if request.method == 'POST':
            data = request.json
            app.last_direction = data.get('direction', 'none')
            app.last_update_time = time.time()
            return jsonify({
                'success': True,
                'direction': data['direction']
            })
        else:
            direction = app.last_direction
            app.last_direction = 'none'
            return jsonify({
                'success': True,
                'direction': direction
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/controller-stream')
def controller_stream():
    def generate():
        while True:
            if app.last_direction != 'none':
                yield f"data: {json.dumps({'direction': app.last_direction})}\n\n"
                app.last_direction = 'none'
            time.sleep(0.016)  # ~60fps

    response = Response(stream_with_context(generate()), mimetype='text/event-stream')
    response.headers['Cache-Control'] = 'no-cache'
    response.headers['Connection'] = 'keep-alive'
    response.headers['X-Accel-Buffering'] = 'no'
    return response

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