/**
 * AlternativesList — renders eco-friendly product alternatives
 */
export default function AlternativesList({ alternatives, productName }) {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="alternatives-card">
      <div className="card-title">🌱 Eco-Friendly Alternatives</div>
      <p className="alternatives-intro">
        Since <strong>{productName}</strong> has environmental concerns, here are more sustainable
        options at a similar price range that you can buy today:
      </p>
      <div className="alternatives-list">
        {alternatives.map((alt, i) => (
          <div className="alternative-item" key={i}>
            <div>
              <div className="alt-name">{alt.name}</div>
              {alt.brand && <div className="alt-brand">by {alt.brand}</div>}
              <p className="alt-why">{alt.why_better}</p>
              <div className="alt-meta">
                {alt.price_range && (
                  <span className="alt-price">💰 {alt.price_range}</span>
                )}
                {alt.where_to_buy && (
                  <span className="alt-where">
                    🛒 {alt.where_to_buy}
                  </span>
                )}
              </div>
            </div>
            {/* Rank badge */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#dcfce7",
                color: "#15803d",
                fontSize: "0.75rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-label={`Alternative ${i + 1}`}
            >
              {i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
