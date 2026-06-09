import { POLICY_STATUSES } from '../utils/constants.js';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

export default function SummaryPanel({ summary }) {
  const totalPolicies = Object.values(summary.countsByStatus || {}).reduce((total, count) => total + count, 0);

  return (
    <section className="summary-panel" aria-labelledby="summary-panel-heading">
      <h2 id="summary-panel-heading">Summary</h2>
      <div className="summary-top-row">
        <div className="summary-stat">
          <span className="stat-label">Total</span>
          <span className="stat-value">{totalPolicies}</span>
        </div>
        {POLICY_STATUSES.map((status) => (
          <div key={status} className="summary-stat">
            <span className="stat-label">{status}</span>
            <span className="stat-value">{summary.countsByStatus?.[status] ?? 0}</span>
          </div>
        ))}
        <div className="summary-stat">
          <span className="stat-label">Expiring Soon</span>
          <span className="stat-value">{summary.expiringSoon ?? 0}</span>
        </div>
      </div>
      <div className="summary-premium">
        <h3>Premium by Line of Business</h3>
        <ul className="premium-list">
          {Object.entries(summary.premiumByLine || {}).map(([line, total]) => (
            <li key={line}>
              <span className="premium-line">{line}:</span>
              <span className="premium-amount">{formatCurrency(total)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
