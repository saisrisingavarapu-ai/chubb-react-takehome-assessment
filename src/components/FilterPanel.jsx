import { LINES_OF_BUSINESS, POLICY_STATUSES, REGIONS } from '../utils/constants.js';

export default function FilterPanel({ filters, onChange }) {
  return (
    <section className="filter-panel" aria-labelledby="filter-panel-heading">
      <div className="filter-heading">
        <h2 id="filter-panel-heading">Filters</h2>
      </div>
      <form className="filter-grid" onSubmit={(event) => event.preventDefault()}>
        <label className="filter-field">
          <span>Search</span>
          <input
            type="search"
            name="search"
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
            placeholder="Policy #, holder, or underwriter"
            aria-label="Search policies"
          />
        </label>
        <label className="filter-field">
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(event) => onChange('status', event.target.value)}
            aria-label="Filter by policy status"
          >
            <option value="">All</option>
            {POLICY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-field">
          <span>Line of Business</span>
          <select
            value={filters.lineOfBusiness}
            onChange={(event) => onChange('lineOfBusiness', event.target.value)}
            aria-label="Filter by line of business"
          >
            <option value="">All</option>
            {LINES_OF_BUSINESS.map((line) => (
              <option key={line} value={line}>
                {line}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-field">
          <span>Region</span>
          <select
            value={filters.region}
            onChange={(event) => onChange('region', event.target.value)}
            aria-label="Filter by region"
          >
            <option value="">All</option>
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-field">
          <span>Effective From</span>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(event) => onChange('fromDate', event.target.value)}
            aria-label="Filter by effective date from"
          />
        </label>
        <label className="filter-field">
          <span>Expiry To</span>
          <input
            type="date"
            value={filters.toDate}
            onChange={(event) => onChange('toDate', event.target.value)}
            aria-label="Filter by expiry date to"
          />
        </label>
      </form>
    </section>
  );
}
