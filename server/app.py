from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load your model and scaler
model = joblib.load('modelo_dificultad.pkl')
scaler = joblib.load('mmscaler_juego_cruce_calle.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse input JSON from the client
        data = request.get_json()
        features = np.array([
            data["edad_jugador"],
            data["tiempo_cruce"],
            data["velocidad_vehiculos"],
            data["num_carriles"],
            data["num_intentos"]
        ]).reshape(1, -1)

        # Scale the features
        features_scaled = scaler.transform(features)

        # Make a prediction
        prediction = model.predict(features_scaled)
        return jsonify({"dificultad": prediction[0]})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
