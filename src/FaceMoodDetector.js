import React, { useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

function FaceMoodDetector({ onMoodDetected }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [status, setStatus] = useState('');

  const loadModels = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    try {
      setStatus(' Loading AI models...');
      // Load one at a time — more reliable than Promise.all
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      setStatus(' Models ready!');
      console.log(" Both models loaded successfully");
      return true;
    } catch (err) {
      console.error(" Model load error:", err);
      setStatus(' Model load failed');
      alert("Models could not be loaded. Check /public/models folder.");
      return false;
    }
  };

  const stopVideoStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsDetecting(false);
    setStatus('');
  };

  const handleDetect = async () => {
    setIsDetecting(true);

    // Load models fresh every time — most reliable approach
    const loaded = await loadModels();
    if (!loaded) {
      setIsDetecting(false);
      return;
    }

    // Extra safety wait — ensure models are fully initialized
    await new Promise(resolve => setTimeout(resolve, 500));

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((videoStream) => {
        videoRef.current.srcObject = videoStream;
        streamRef.current = videoStream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setStatus(' Look at the camera...');

          setTimeout(async () => {
            try {
              setStatus(' Analyzing your expression...');

              // Verify model is truly loaded before inference
              if (!faceapi.nets.tinyFaceDetector.isLoaded) {
                alert("Model not ready yet. Please try again.");
                stopVideoStream();
                return;
              }

              const detection = await faceapi
                .detectSingleFace(
                  videoRef.current,
                  new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.3 })
                )
                .withFaceExpressions();

              if (detection?.expressions) {
                const sorted = Object.entries(detection.expressions).sort((a, b) => b[1] - a[1]);
                const topMood = sorted[0][0];
                console.log(" Detected Mood:", topMood, "| Confidence:", sorted[0][1]);
                setStatus(`Detected: ${topMood}`);
                onMoodDetected(topMood);
              } else {
                alert("No face detected. Make sure your face is visible and well-lit.");
              }
            } catch (err) {
              console.error("Detection error:", err);
              alert("Detection failed: " + err.message);
            }

            stopVideoStream();
          }, 5000);
        };
      })
      .catch((err) => {
        console.error(" Camera access error:", err);
        alert("Camera access denied. Please allow camera permission.");
        setIsDetecting(false);
        setStatus('');
      });
  };

  return (
    <div style={{ marginTop: '30px' }}>
      {!isDetecting && (
        <button
          onClick={handleDetect}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '8px',
            backgroundColor: '#6200ea',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
           Start Mood Detection
        </button>
      )}

      {isDetecting && (
        <div>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            width="320"
            height="240"
            style={{ marginTop: '20px', borderRadius: '10px', background: '#000', display: 'block' }}
          />
          <p style={{ marginTop: '10px', fontWeight: '500' }}>{status || ' Starting...'}</p>
        </div>
      )}
    </div>
  );
}

export default FaceMoodDetector;