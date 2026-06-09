import React from 'react';
import { PAGE_SIZE_OPTIONS } from '../utils/constants.js';

export default function PolicyTable({
  policies,
  selectedIds,
  toggleSelection,
  setSelectAll,
  sortField,
  sortOrder,
  setSort,
  allSelected,
  totalCount,
  page,
  pageSize,
  onPageSizeChange
}) {
  const headers = [
    { key: 'policyNumber', label: 'Policy #', sortable: true },
    { key: 'policyholderName', label: 'Policyholder' },
    { key: 'lineOfBusiness', label: 'Line of Business' },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'premiumAmount', label: 'Premium' },
    { key: 'currency', label: 'Currency' },
    { key: 'effectiveDate', label: 'Effective Date', sortable: true },
    { key: 'expiryDate', label: 'Expiry Date', sortable: true },
    { key: 'region', label: 'Region' },
    { key: 'underwriter', label: 'Underwriter' },
    { key: 'flaggedForReview', label: 'Flagged' }
  ];

  const renderSortLabel = (header) => {
    const direction = sortField === header.key ? sortOrder : 'asc';
    return `${header.label}${header.sortable ? ` ${direction === 'asc' ? '▲' : '▼'}` : ''}`;
  };

  return (
    <div className="policy-table-wrapper">
      <div className="policy-table-meta">
        <p>
          Showing {policies.length} of {totalCount} policies on page {page}.
        </p>
      </div>
      <table className="policy-table" aria-label="Policy overview table">
        <caption>Policy overview and bulk management</caption>
        <thead>
          <tr>
            <th scope="col">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(event) => setSelectAll(event.target.checked)}
                aria-label="Select all displayed policies"
              />
            </th>
            {headers.map((header) => (
              <th key={header.key} scope="col">
                {header.sortable ? (
                  <button
                    type="button"
                    className="sort-button"
                    onClick={() => setSort(header.key)}
                    aria-label={`Sort by ${header.label}`}
                  >
                    {renderSortLabel(header)}
                  </button>
                ) : (
                  header.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr key={policy.id} className={policy.flaggedForReview ? 'flagged-row' : ''}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(policy.id)}
                  onChange={() => toggleSelection(policy.id)}
                  aria-label={`Select policy ${policy.policyNumber}`}
                />
              </td>
              <td>{policy.policyNumber}</td>
              <td>{policy.policyholderName}</td>
              <td>{policy.lineOfBusiness}</td>
              <td>{policy.status}</td>
              <td>{Number(policy.premiumAmount).toLocaleString()}</td>
              <td>{policy.currency}</td>
              <td>{new Date(policy.effectiveDate).toLocaleDateString()}</td>
              <td>{new Date(policy.expiryDate).toLocaleDateString()}</td>
              <td>{policy.region}</td>
              <td>{policy.underwriter}</td>
              <td>{policy.flaggedForReview ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="policy-table-footer">
        <label className="page-size-field">
          <span>Rows per page</span>
          <select value={pageSize} onChange={(event) => onPageSizeChange(event.target.value)} aria-label="Select number of rows per page">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
