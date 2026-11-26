/**
 * AnalysisBreakdown — 5-dimension analysis grid + pros/cons
 */
export default function AnalysisBreakdown({ analysis, positive_aspects, concerns }) {
  const dimensions = [
    { key: "materials",      label: "Materials",        icon: "🧱" },
    { key: "manufacturing",  label: "Manufacturing",    icon: "🏭" },
    { key: "durability",     label: "Durability",       icon: "⏳" },
    { key: "recyclability",  label: "Recyclability",    icon: "♻️" },
    { key: "packaging",      label: "Packaging",        icon: "📦" },
  ];

  return (
    <>
      {/* 5-dimension grid */}
      <div className="analysis-card">
        <div className="card-title">🔬 Detailed Analysis</div>
        <div className="analysis-grid">
          {dimensions.map(({ key, label, icon }) =>
            analysis[key] ? (
              <div className="analysis-item" key={key}>
                <h4>{icon} {label}</h4>
                <p>{analysis[key]}</p>
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Pros & cons */}
      {((positive_aspects && positive_aspects.length > 0) || (concerns && concerns.length > 0)) && (
        <div className="analysis-card">
          <div className="card-title">⚖️ Highlights</div>
          <div className="pros-cons-grid">
            {positive_aspects && positive_aspects.length > 0 && (
              <div className="pros-box">
                <h4>What's good</h4>
                <ul>
                  {positive_aspects.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {concerns && concerns.length > 0 && (
              <div className="cons-box">
                <h4>Concerns</h4>
                <ul>
                  {concerns.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
