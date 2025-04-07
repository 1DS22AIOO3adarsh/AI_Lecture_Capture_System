from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from whisper_transcribe import transcribe_audio

app = Flask(__name__)
CORS(app)  # Allow requests from different origins (like React)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'data', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return "AI Lecture Capture System API is running."

@app.route("/upload", methods=["POST"])
def upload_video():
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    return jsonify({"message": "File uploaded successfully", "filename": file.filename}), 200

if __name__ == "__main__":
    app.run(debug=True, port=8000)
