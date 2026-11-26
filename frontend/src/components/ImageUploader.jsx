import { useRef, useState } from "react";

/**
 * ImageUploader — handles drag-drop, file input, and mobile camera capture.
 * Props:
 *   onImageSelected(file, previewUrl) — called when a valid image is chosen
 */
export default function ImageUploader({ onImageSelected }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    onImageSelected(file, url);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  function handleChange(e) {
    const file = e.target.files[0];
    handleFile(file);
    // reset input so same file can be re-selected
    e.target.value = "";
  }

  return (
    <div
      className={`upload-zone ${dragOver ? "drag-over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
      aria-label="Click or drop an image here"
    >
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
        aria-hidden="true"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        style={{ display: "none" }}
        aria-hidden="true"
      />

      <div className="upload-icon">🌿</div>
      <h3>Drop a product image here</h3>
      <p>or click to browse files (JPG, PNG, WEBP)</p>

      <div className="or-divider">— or —</div>

      <button
        className="camera-btn"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          cameraInputRef.current?.click();
        }}
        aria-label="Open camera to take a photo"
      >
        📷 Take a Photo
      </button>
    </div>
  );
}
