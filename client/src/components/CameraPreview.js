import React, { useRef, useState } from "react";

function CameraPreview() {
  const videoRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");

  const handleEnableCamera = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Unable to access camera. Please check permissions.");
      setIsActive(false);
    }
  };

  return (
    <div className="camera-card">
      <h3 className="camera-title">Camera preview</h3>
      <p className="camera-subtext">
        Enable your camera to see yourself while answering. This video stays
        only on your device.
      </p>

      <div className="camera-preview-box">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="camera-video"
        />
        {!isActive && (
          <div className="camera-overlay">
            <p>Camera is off</p>
          </div>
        )}
      </div>

      <button className="btn-primary camera-btn" onClick={handleEnableCamera}>
        {isActive ? "Restart camera" : "Enable camera"}
      </button>

      {error && <p className="camera-error">{error}</p>}
    </div>
  );
}

export default CameraPreview;
