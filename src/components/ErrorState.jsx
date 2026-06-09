export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <h2>Error loading policies</h2>
      <p>{message}</p>
      <button type="button" className="secondary-button" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
