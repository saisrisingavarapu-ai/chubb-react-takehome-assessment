export default function ActionBar({ selectedCount, onFlag, actionMessage }) {
  return (
    <div className="action-bar" aria-live="polite">
      <div className="action-controls">
        <button
          type="button"
          className="primary-button"
          disabled={selectedCount === 0}
          onClick={onFlag}
          aria-disabled={selectedCount === 0}
        >
          Flag for Review
        </button>
        <div className="action-summary">
          <p>{selectedCount} selected</p>
        </div>
      </div>
      {actionMessage ? <p className="action-message">{actionMessage}</p> : null}
    </div>
  );
}
