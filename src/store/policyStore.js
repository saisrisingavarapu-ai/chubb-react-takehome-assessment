import { create } from 'zustand';
import { fetchPolicies as fetchPoliciesApi, patchPolicy } from '../utils/api.js';
import { logError } from '../utils/logger.js';
import { POLICY_STATUSES, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../utils/constants.js';

const defaultFilters = {
  status: '',
  lineOfBusiness: '',
  region: '',
  search: '',
  fromDate: '',
  toDate: '',
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  sortField: 'expiryDate',
  sortOrder: 'asc'
};

function normalizePageNumber(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

function buildPolicyQuery(filters, noPage = false) {
  const params = {
    _sort: filters.sortField,
    _order: filters.sortOrder
  };

  if (filters.search) {
    params.q = filters.search;
  }
  if (filters.status) {
    params.status = filters.status;
  }
  if (filters.lineOfBusiness) {
    params.lineOfBusiness = filters.lineOfBusiness;
  }
  if (filters.region) {
    params.region = filters.region;
  }
  if (filters.fromDate) {
    params.effectiveDate_gte = filters.fromDate;
  }
  if (filters.toDate) {
    params.expiryDate_lte = filters.toDate;
  }
  if (!noPage) {
    params._page = filters.page;
    params._limit = filters.pageSize;
  }

  return params;
}

function createSummaryData(policies) {
  const countsByStatus = POLICY_STATUSES.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});

  const premiumByLine = {};
  let expiringSoon = 0;
  const now = new Date();
  const threshold = new Date(now);
  threshold.setDate(now.getDate() + 30);

  for (const policy of policies) {
    countsByStatus[policy.status] = (countsByStatus[policy.status] || 0) + 1;
    premiumByLine[policy.lineOfBusiness] = (premiumByLine[policy.lineOfBusiness] || 0) + Number(policy.premiumAmount || 0);

    const expiry = new Date(policy.expiryDate);
    if (expiry >= now && expiry <= threshold) {
      expiringSoon += 1;
    }
  }

  return {
    countsByStatus,
    premiumByLine,
    expiringSoon
  };
}

const usePolicyStore = create((set, get) => ({
  policies: [],
  summary: {
    countsByStatus: {},
    premiumByLine: {},
    expiringSoon: 0
  },
  filters: defaultFilters,
  status: 'idle',
  error: null,
  totalCount: 0,
  selectedIds: [],
  actionMessage: '',
  setFilters: (updates) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...updates,
        page: updates.page ? normalizePageNumber(updates.page) : state.filters.page
      }
    }));
  },
  setFiltersFromQuery: (params) => {
    const requestedPageSize = Number(params.pageSize);
    const parsedPageSize = PAGE_SIZE_OPTIONS.includes(requestedPageSize) ? requestedPageSize : DEFAULT_PAGE_SIZE;
    const parsed = {
      status: params.status || '',
      lineOfBusiness: params.lineOfBusiness || '',
      region: params.region || '',
      search: params.search || '',
      fromDate: params.fromDate || '',
      toDate: params.toDate || '',
      page: normalizePageNumber(params.page ?? 1),
      pageSize: parsedPageSize,
      sortField: params.sortField || 'expiryDate',
      sortOrder: params.sortOrder || 'asc'
    };

    set({ filters: parsed });
  },
  setSort: (field) => {
    set((state) => ({
      filters: {
        ...state.filters,
        sortField: field,
        sortOrder: state.filters.sortOrder === 'asc' ? 'desc' : 'asc'
      }
    }));
  },
  setPage: (page) => {
    set((state) => ({ filters: { ...state.filters, page: normalizePageNumber(page) } }));
  },
  setPageSize: (pageSize) => {
    set((state) => ({ filters: { ...state.filters, pageSize: Number(pageSize), page: 1 } }));
  },
  toggleSelection: (id) => {
    set((state) => {
      const selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedIds, id];
      return { selectedIds };
    });
  },
  setSelectAll: (checked) => {
    set((state) => ({
      selectedIds: checked ? state.policies.map((policy) => policy.id) : []
    }));
  },
  clearSelection: () => set({ selectedIds: [] }),
  fetchSummary: async (filters) => {
    try {
      const response = await fetchPoliciesApi(buildPolicyQuery(filters, true));
      const summary = createSummaryData(response.data);
      set({ summary });
    } catch (error) {
      logError(error, 'fetchSummary');
      set({ summary: { countsByStatus: {}, premiumByLine: {}, expiringSoon: 0 } });
    }
  },
  fetchPolicies: async () => {
    set({ status: 'loading', error: null, actionMessage: '' });
    const { filters } = get();

    try {
      const response = await fetchPoliciesApi(buildPolicyQuery(filters));
      const totalCount = Number(response.headers['x-total-count'] || 0);
      set({ policies: response.data, status: 'success', totalCount });
      await get().fetchSummary(filters);
    } catch (error) {
      logError(error, 'fetchPolicies');
      set({ status: 'error', error: 'Unable to load policy data. Please try again.' });
    }
  },
  flagSelectedForReview: async () => {
    const selectedIds = get().selectedIds;
    if (!selectedIds.length) {
      set({ actionMessage: 'Select policies before flagging.' });
      return;
    }

    set((state) => ({
      policies: state.policies.map((policy) =>
        selectedIds.includes(policy.id) ? { ...policy, flaggedForReview: true } : policy
      ),
      actionMessage: `Flagging ${selectedIds.length} policy(ies) for review...`
    }));

    try {
      await Promise.all(
        selectedIds.map((id) => patchPolicy(id, { flaggedForReview: true }))
      );
      set({ actionMessage: `Successfully flagged ${selectedIds.length} policy(ies) for review.` });
      get().clearSelection();
      await get().fetchPolicies();
    } catch (error) {
      logError(error, 'flagSelectedForReview');
      set({ actionMessage: 'Unable to flag selected policies. Please try again.' });
      await get().fetchPolicies();
    }
  },
  retryFetch: () => get().fetchPolicies()
}));

export default usePolicyStore;
