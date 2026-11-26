import { useState, useCallback } from "react";
import ImageUploader from "./components/ImageUploader";
import ScoreCard from "./components/ScoreCard";
import AnalysisBreakdown from "./components/AnalysisBreakdown";
import AlternativesList from "./components/AlternativesList";

// App states
const STATE = {
  IDLE: "idle",
  PREVIEW: "preview",
  LOADING: "loading",
  RESULT: "result",
  ERROR: "error",
};

const LOADING_STEPS = [
  "Identifying the product...",
  "Assessing materials and composition...",
  "Evaluating environmental impact...",
  "Searching for eco-friendly alternatives...",
  "Generating your sustainability report...",
];

export default function App() {
  const [appState, setAppState] = useState(STATE.IDLE);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // Called by ImageUploader when user picks/drops/captures an image
  const handleImageSelected = useCallback((file, url) => {
    setImageFile(file);
    setPreviewUrl(url);
    setAppState(STATE.PREVIEW);
    setResult(null);
    setError(null);
  }, []);

  // Animate through loading steps for UX feedback
  function animateLoadingSteps() {
    let step = 0;
    setLoadingStep(0);
    const interval = setInterval(() => {
      step += 1;
      if (step >= LOADING_STEPS.length) {
        clearInterval(interval);
      } else {
        setLoadingStep(step);
      }
    }, 1200);
    return interval;
  }

  async function handleAnalyze() {
    if (!imageFile) return;
    setAppState(STATE.LOADING);
    setError(null);

    const stepInterval = animateLoadingSteps();

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      clearInterval(stepInterval);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      setResult(data);
      setAppState(STATE.RESULT);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.message || "Something went wrong. Please try again.");
      setAppState(STATE.ERROR);
    }
  }

  function handleReset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setAppState(STATE.IDLE);
  }

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="header" role="banner">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon" aria-hidden="true">🌱</div>
            <div>
              <div className="logo-text">EcoScan</div>
              <div className="logo-tagline">AI Sustainability Analyzer</div>
            </div>
          </div>
          <span className="header-badge">🌍 AI for Good</span>
        </div>
      </header>

      {/* Main */}
      <main className="main-content" role="main">
        {/* Hero — only shown when idle */}
        {appState === STATE.IDLE && (
          <section className="hero" aria-labelledby="hero-heading">
            <h1 id="hero-heading">
              Is your product <span>eco-friendly</span>?
            </h1>
            <p>
              Take a photo or upload an image of any product. Our AI instantly
              analyzes its environmental impact and suggests greener alternatives.
            </p>
          </section>
        )}

        {/* Upload card — shown when idle */}
        {appState === STATE.IDLE && (
          <div className="upload-card">
            <ImageUploader onImageSelected={handleImageSelected} />
          </div>
        )}

        {/* Preview state */}
        {appState === STATE.PREVIEW && previewUrl && (
          <div className="upload-card">
            <div className="preview-container">
              <img
                src={previewUrl}
                alt="Selected product"
                className="preview-img"
              />
            </div>
            <div className="preview-actions">
              <button className="btn btn-primary" onClick={handleAnalyze}>
                🔍 Analyze Sustainability
              </button>
              <button className="btn btn-outline" onClick={handleReset}>
                ↩ Choose Different Image
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {appState === STATE.LOADING && (
          <div className="loading-card" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <h3>Analyzing your product...</h3>
            <p>Our AI is evaluating environmental sustainability</p>
            <div className="loading-steps" aria-label="Analysis progress">
              {LOADING_STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`loading-step ${i === loadingStep ? "active" : ""}`}
                >
                  <span aria-hidden="true">{i < loadingStep ? "✓" : i === loadingStep ? "▶" : "○"}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {appState === STATE.ERROR && (
          <div className="error-card" role="alert">
            <div className="error-icon" aria-hidden="true">⚠️</div>
            <h3>Analysis Failed</h3>
            <p>{error}</p>
            <div className="preview-actions">
              <button className="btn btn-primary" onClick={() => setAppState(STATE.PREVIEW)}>
                ↩ Try Again
              </button>
              <button className="btn btn-outline" onClick={handleReset}>
                Start Over
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {appState === STATE.RESULT && result && (
          <div className="results-wrapper" aria-label="Sustainability analysis results">
            <ScoreCard result={result} />
            <AnalysisBreakdown
              analysis={result.analysis || {}}
              positive_aspects={result.positive_aspects}
              concerns={result.concerns}
            />
            <AlternativesList
              alternatives={result.alternatives}
              productName={result.product_name}
            />
            <div className="scan-again-bar">
              <button className="btn btn-outline" onClick={handleReset}>
                📷 Scan Another Product
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer" role="contentinfo">
        EcoScan · AI for Good Challenge · Helping consumers make sustainable choices
      </footer>
    </div>
  );
}
