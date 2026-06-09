export default function LoadingSkeleton() {
  return (
    <div className="loading-skeleton" aria-live="polite" aria-busy="true">
      <p>Loading policy data...</p>
      <div className="skeleton-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="skeleton-row" />
        ))}
      </div>
    </div>
  );
}
