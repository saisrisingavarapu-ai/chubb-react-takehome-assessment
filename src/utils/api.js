import { logError } from './logger.js';
import policiesData from '../../db.json';

function sortRecords(records, sortField, sortOrder) {
  return [...records].sort((left, right) => {
    const leftValue = left[sortField];
    const rightValue = right[sortField];

    if (leftValue == null) return 1;
    if (rightValue == null) return -1;

    if (typeof leftValue === 'number' || typeof rightValue === 'number') {
      return Number(leftValue) - Number(rightValue);
    }

    return String(leftValue).localeCompare(String(rightValue), undefined, { numeric: true, sensitivity: 'base' });
  }).map((item, index) => ({ ...item, _orderIndex: index }));
}

function filterPoliciesLocally(params = {}) {
  let records = Array.isArray(policiesData.policies) ? [...policiesData.policies] : [];

  if (params.q) {
    const query = String(params.q).toLowerCase();
    records = records.filter((policy) =>
      [
        policy.policyNumber,
        policy.policyholderName,
        policy.lineOfBusiness,
        policy.region,
        policy.underwriter,
        policy.status,
        policy.currency
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }

  if (params.status) {
    records = records.filter((policy) => policy.status === params.status);
  }

  if (params.lineOfBusiness) {
    records = records.filter((policy) => policy.lineOfBusiness === params.lineOfBusiness);
  }

  if (params.region) {
    records = records.filter((policy) => policy.region === params.region);
  }

  if (params.effectiveDate_gte) {
    records = records.filter((policy) => policy.effectiveDate >= params.effectiveDate_gte);
  }

  if (params.expiryDate_lte) {
    records = records.filter((policy) => policy.expiryDate <= params.expiryDate_lte);
  }

  if (params._sort) {
    records = sortRecords(records, params._sort, params._order || 'asc');
    if (params._order === 'desc') {
      records.reverse();
    }
  }

  const totalCount = records.length;
  if (params._page && params._limit) {
    const page = Number(params._page) || 1;
    const limit = Number(params._limit) || totalCount;
    const start = (page - 1) * limit;
    records = records.slice(start, start + limit);
  }

  return {
    data: records,
    headers: {
      'x-total-count': String(totalCount)
    }
  };
}

export async function fetchPolicies(params) {
  return filterPoliciesLocally(params);
}

export async function patchPolicy(id, data) {
  const target = policiesData.policies.find((policy) => policy.id === id);
  if (!target) {
    throw new Error(`Policy not found: ${id}`);
  }
  Object.assign(target, data);
  return { data: target };
}

export async function fetchPolicyById(id) {
  const policy = policiesData.policies.find((item) => item.id === id);
  if (!policy) {
    throw new Error(`Policy not found: ${id}`);
  }
  return { data: policy };
}
