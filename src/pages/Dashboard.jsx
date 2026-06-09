import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel.jsx';
import SummaryPanel from '../components/SummaryPanel.jsx';
import PolicyTable from '../components/PolicyTable.jsx';
import ActionBar from '../components/ActionBar.jsx';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import usePolicyStore from '../store/policyStore.js';
import usePreferencesStore from '../store/preferencesStore.js';
import { applyTheme } from '../utils/theme.js';
import '../styles/dashboard.scss';

function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = usePolicyStore((state) => state.filters);
  const policies = usePolicyStore((state) => state.policies);
  const selectedIds = usePolicyStore((state) => state.selectedIds);
  const status = usePolicyStore((state) => state.status);
  const error = usePolicyStore((state) => state.error);
  const summary = usePolicyStore((state) => state.summary);
  const totalCount = usePolicyStore((state) => state.totalCount);
  const actionMessage = usePolicyStore((state) => state.actionMessage);
  const fetchPolicies = usePolicyStore((state) => state.fetchPolicies);
  const retryFetch = usePolicyStore((state) => state.retryFetch);
  const setFilters = usePolicyStore((state) => state.setFilters);
  const setFiltersFromQuery = usePolicyStore((state) => state.setFiltersFromQuery);
  const toggleSelection = usePolicyStore((state) => state.toggleSelection);
  const setSelectAll = usePolicyStore((state) => state.setSelectAll);
  const setSort = usePolicyStore((state) => state.setSort);
  const flagSelectedForReview = usePolicyStore((state) => state.flagSelectedForReview);
  const setPage = usePolicyStore((state) => state.setPage);
  const setPageSize = usePolicyStore((state) => state.setPageSize);

  const pageSizePreference = usePreferencesStore((state) => state.pageSize);
  const setPageSizePreference = usePreferencesStore((state) => state.setPageSize);
  const theme = usePreferencesStore((state) => state.theme);
  const setTheme = usePreferencesStore((state) => state.setTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length) {
      setFiltersFromQuery(params);
    }
  }, []);

  useEffect(() => {
    const queryObject = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        queryObject[key] = String(value);
      }
    });
    setSearchParams(queryObject, { replace: true });
  }, [filters, setSearchParams]);

  useEffect(() => {
    if (filters.pageSize !== pageSizePreference) {
      setPageSize(pageSizePreference);
    }
  }, [pageSizePreference, setPageSize]);

  useEffect(() => {
    setPageSizePreference(filters.pageSize);
  }, [filters.pageSize, setPageSizePreference]);

  useEffect(() => {
    fetchPolicies();
  }, [filters, fetchPolicies]);

  const handleFilterChange = (field, value) => {
    setFilters({ [field]: value, page: 1 });
  };

  const handlePageSizeChange = (size) => {
    setPageSize(Number(size));
  };

  const pageCount = Math.max(1, Math.ceil(totalCount / filters.pageSize));
  const allSelected = policies.length > 0 && selectedIds.length === policies.length;

  return (
    <main className="dashboard-page" aria-labelledby="dashboard-title">
      <section className="dashboard-header">
        <div>
          <h1 id="dashboard-title">Policy Overview</h1>
          <p className="dashboard-intro">
            Manage policy records with filters, bulk actions, and status summaries.
          </p>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          Switch to {theme === 'dark' ? 'light' : 'dark'} theme
        </button>
      </section>

      <SummaryPanel summary={summary} />
      <FilterPanel filters={filters} onChange={handleFilterChange} />
      <ActionBar selectedCount={selectedIds.length} onFlag={flagSelectedForReview} actionMessage={actionMessage} />

      {status === 'loading' && !policies.length && <LoadingSkeleton />}
      {status === 'error' && <ErrorState message={error} onRetry={retryFetch} />}
      {policies.length > 0 && (
        <PolicyTable
          policies={policies}
          selectedIds={selectedIds}
          toggleSelection={toggleSelection}
          setSelectAll={setSelectAll}
          sortField={filters.sortField}
          sortOrder={filters.sortOrder}
          setSort={setSort}
          allSelected={allSelected}
          totalCount={totalCount}
          page={filters.page}
          pageSize={filters.pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
      {status === 'success' && policies.length === 0 && (
        <EmptyState message="No policies match the current filter selection. Adjust filters or clear the search." />
      )}

      <div className="pagination-controls">
        <button
          type="button"
          onClick={() => setPage(filters.page - 1)}
          disabled={filters.page <= 1}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span>
          Page {filters.page} of {pageCount}
        </span>
        <button
          type="button"
          onClick={() => setPage(filters.page + 1)}
          disabled={filters.page >= pageCount}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </main>
  );
}

export default Dashboard;
