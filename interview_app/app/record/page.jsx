"use client"; // Only if using Next.js 13

import React, { useState } from "react";
import MicRecorder from "mic-recorder-to-mp3";

const AudioRecorder = () => {
  const [recorder] = useState(new MicRecorder({ bitRate: 128 }));
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  // Start recording
  const startRecording = () => {
    recorder
      .start()
      .then(() => {
        setRecording(true);
      })
      .catch((e) => {
        console.error(e);
        setError("Error starting recording. Please allow microphone access.");
      });
  };

  // Stop recording
  const stopRecording = async () => {
    try {
      const [buffer, blob] = await recorder.stop().getMp3();
      const file = new File(buffer, "recording.mp3", {
        type: blob.type,
        lastModified: Date.now(),
      });

      const audioUrl = URL.createObjectURL(file);
      setAudioUrl(audioUrl);
      setRecording(false);

      // Upload to Google Drive
      await uploadToDrive(file);
    } catch (e) {
      console.error(e);
      setError("Error stopping recording.");
      setRecording(false);
    }
  };

  // Upload to Google Drive
  const uploadToDrive = async (file) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result.split(",")[1]; // Get base64 string without metadata

        const response = await fetch("http://localhost:5000/upload", {
          // Adjust to your server URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audioBlob: base64data }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("File uploaded to Google Drive with ID:", data.fileId);
        } else {
          throw new Error("Failed to upload file to Google Drive");
        }
      };
    } catch (error) {
      console.error("Error uploading to Google Drive:", error);
      setError("Error uploading to Google Drive.");
    }
  };

  return (
    <div>
      <h2>Audio Recorder</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>

      {audioUrl && (
        <div>
          <audio controls src={audioUrl}></audio>
          <a href={audioUrl} download="recording.mp3">
            Download MP3
          </a>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
