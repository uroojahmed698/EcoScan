import { getScoreColors } from "../utils/scoreColors";

/**
 * ScoreCard — big score circle + product name + summary
 */
export default function ScoreCard({ result }) {
  const { score_label, sustainability_score, product_name, product_category, summary } = result;
  const colors = getScoreColors(sustainability_score);
  const pct = (sustainability_score / 10) * 100;

  return (
    <div className="score-card">
      {/* Score circle */}
      <div
        className="score-circle"
        style={{
          color: colors.circle,
          backgroundColor: colors.circleBg,
          borderColor: colors.circle,
        }}
        aria-label={`Sustainability score: ${sustainability_score} out of 10`}
      >
        <span className="score-number">{sustainability_score}</span>
        <span className="score-denom">/10</span>
      </div>

      {/* Info */}
      <div className="score-info">
        <span
          className="score-label-badge"
          style={{
            backgroundColor: colors.badge.bg,
            color: colors.badge.color,
            border: `1px solid ${colors.circle}40`,
          }}
        >
          {score_label || colors.label}
        </span>
        <div className="product-name">{product_name}</div>
        <span className="product-category">{product_category}</span>
        <p className="summary-text">{summary}</p>

        {/* Score bar */}
        <div className="score-bar-container">
          <div className="score-bar-track" role="progressbar" aria-valuenow={sustainability_score} aria-valuemin={0} aria-valuemax={10}>
            <div
              className="score-bar-fill"
              style={{
                width: `${pct}%`,
                backgroundColor: colors.barFill,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
