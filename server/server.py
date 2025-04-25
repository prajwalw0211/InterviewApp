from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import re
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

FILLER_WORDS = ["um", "uh", "ah", "hmm", "like", "you know", "so", "actually", "basically", "right"]

def count_filler_words(transcription):
    """Counts occurrences of filler words in the transcription."""
    word_counts = {word: 0 for word in FILLER_WORDS}
    transcription = transcription.lower()
    
    for word in FILLER_WORDS:
        pattern = rf"\b{word}\b"
        matches = re.findall(pattern, transcription)
        word_counts[word] = len(matches)

    total_filler_count = sum(word_counts.values())  # Compute total filler words
    return word_counts, total_filler_count

def transcribe_audio(file_path, initial_prompt="Include all filler words like um, uh, ah, hmm, etc."):
    """Transcribes the audio file using Whisper."""
    model = whisper.load_model("base")  # Load Whisper model
    result = model.transcribe(file_path, initial_prompt=initial_prompt)
    return result["text"]

@app.route("/upload", methods=["POST"])
def upload_audio():
    """Handles file uploads and processes audio transcription & filler words."""
    if "audio" not in request.files:
        return jsonify({"error": "No audio file found"}), 400

    audio_file = request.files["audio"]
    file_path = f"uploads/{audio_file.filename}"
    
    os.makedirs("uploads", exist_ok=True)
    audio_file.save(file_path)

    # Transcribe and analyze the audio
    transcription_text = transcribe_audio(file_path)
    print(transcription_text)

    filler_word_counts, total_filler_count = count_filler_words(transcription_text)

    os.remove(file_path)  # Clean up file after processing

    return jsonify({
        "transcription": transcription_text,
        "filler_words": filler_word_counts,
        "total_filler_count": total_filler_count  # Return total filler word count
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
