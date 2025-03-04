from flask import Flask, request, jsonify, render_template
import google.generativeai as ai

API_KEY = "AIzaSyCKSkrHWgyTfEucLosrxAG7VJ-_YLTrEUs"
ai.configure(api_key=API_KEY)
model_name = "gemini-1.5-pro"
model = ai.GenerativeModel(model_name)
chat = model.start_chat()

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    user_input = data.get("input", "")

    if user_input.lower() == "bye":
        response_text = "Goodbye!"
    else:
        response = chat.send_message(user_input)
        response_text = response.text

    return jsonify({"output": response_text})

if __name__ == '__main__':
    app.run(debug=True)
