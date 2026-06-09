export default function EmptyState({ message }) {
  return (
    <div className="empty-state" role="status">
      <h2>No results found</h2>
      <p>{message}</p>
    </div>
  );
}
