import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PAGE_SIZE_OPTIONS } from '../utils/constants.js';
import PolicyTable from './PolicyTable.jsx';

const policies = [
  {
    id: 'policy-1',
    policyNumber: 'POL-000001',
    policyholderName: 'Amit Kumar',
    lineOfBusiness: 'Property',
    status: 'Active',
    premiumAmount: 5000,
    currency: 'USD',
    effectiveDate: '2024-01-01',
    expiryDate: '2024-12-31',
    region: 'Singapore',
    underwriter: 'Chubb APAC',
    flaggedForReview: false
  },
  {
    id: 'policy-2',
    policyNumber: 'POL-000002',
    policyholderName: 'Grace Wong',
    lineOfBusiness: 'Casualty',
    status: 'Expired',
    premiumAmount: 7500,
    currency: 'SGD',
    effectiveDate: '2024-06-01',
    expiryDate: '2025-06-01',
    region: 'Hong Kong',
    underwriter: 'Pacific Risk',
    flaggedForReview: true
  }
];

describe('PolicyTable component', () => {
  it('renders a table with policy rows', () => {
    render(
      <PolicyTable
        policies={policies}
        selectedIds={[]}
        toggleSelection={vi.fn()}
        setSelectAll={vi.fn()}
        sortField="expiryDate"
        sortOrder="asc"
        setSort={vi.fn()}
        allSelected={false}
        totalCount={2}
        page={1}
        pageSize={5}
        onPageSizeChange={vi.fn()}
      />
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('POL-000001')).toBeInTheDocument();
    expect(screen.getByText('POL-000002')).toBeInTheDocument();
    expect(screen.getByLabelText('Select number of rows per page')).toHaveValue('5');
  });

  it('renders all page size options', () => {
    render(
      <PolicyTable
        policies={policies}
        selectedIds={[]}
        toggleSelection={vi.fn()}
        setSelectAll={vi.fn()}
        sortField="expiryDate"
        sortOrder="asc"
        setSort={vi.fn()}
        allSelected={false}
        totalCount={2}
        page={1}
        pageSize={5}
        onPageSizeChange={vi.fn()}
      />
    );

    PAGE_SIZE_OPTIONS.forEach((size) => {
      expect(screen.getByRole('option', { name: String(size) })).toBeInTheDocument();
    });
  });

  it('calls onPageSizeChange when a new page size is selected', async () => {
    const onPageSizeChange = vi.fn();
    render(
      <PolicyTable
        policies={policies}
        selectedIds={[]}
        toggleSelection={vi.fn()}
        setSelectAll={vi.fn()}
        sortField="expiryDate"
        sortOrder="asc"
        setSort={vi.fn()}
        allSelected={false}
        totalCount={2}
        page={1}
        pageSize={10}
        onPageSizeChange={onPageSizeChange}
      />
    );

    await userEvent.selectOptions(screen.getByLabelText('Select number of rows per page'), '15');
    expect(onPageSizeChange).toHaveBeenCalledWith('15');
  });
});
