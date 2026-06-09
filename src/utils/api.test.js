import { describe, it, expect } from 'vitest';
import { fetchPolicies, fetchPolicyById, patchPolicy } from './api.js';
import policiesData from '../../db.json';

describe('policy API utilities', () => {
  it('returns filtered policy records and total count', async () => {
    const response = await fetchPolicies({ status: 'Active', _page: 1, _limit: 10 });

    expect(response.headers['x-total-count']).toBeDefined();
    expect(response.data.length).toBeLessThanOrEqual(10);
    expect(response.data.every((policy) => policy.status === 'Active')).toBe(true);
  });

  it('returns matching policy by ID', async () => {
    const policy = policiesData.policies[0];
    const response = await fetchPolicyById(policy.id);

    expect(response.data).toEqual(policy);
  });

  it('updates a policy record when patching', async () => {
    const policy = policiesData.policies[0];
    const updated = await patchPolicy(policy.id, { flaggedForReview: true });

    expect(updated.data.flaggedForReview).toBe(true);
    expect(policiesData.policies.find((item) => item.id === policy.id).flaggedForReview).toBe(true);
  });
});
