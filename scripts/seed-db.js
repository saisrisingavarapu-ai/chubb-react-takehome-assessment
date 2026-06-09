import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const outputPath = path.resolve(process.cwd(), 'db.json');
const policyHolderNames = [
  'Amit Kumar',
  'Grace Wong',
  'Ming Lee',
  'Sara Tan',
  'Kenji Yamamoto',
  'Nina Lim',
  'Ravi Patel',
  'Jasmine Ng',
  'Li Wei',
  'Anna Chan',
  'Michael Tay',
  'Hiroshi Sato',
  'Siti Aisyah',
  'Daniel Koh',
  'Priya Nair'
];
const underwriters = ['Chubb APAC', 'Pacific Risk', 'Asia Sure', 'Regional Underwriters', 'Global Cover'];
const linesOfBusiness = ['Property', 'Casualty', 'A&H', 'Marine'];
const statuses = ['Active', 'Expired', 'Pending', 'Cancelled'];
const currencies = ['USD', 'SGD', 'HKD', 'AUD', 'JPY', 'THB'];
const regions = ['Singapore', 'Hong Kong', 'Australia', 'Japan', 'Thailand', 'Indonesia', 'Malaysia', 'Philippines'];

function randomBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatPolicyNumber(index) {
  return `POL-${String(index + 1).padStart(6, '0')}`;
}

function createPolicy(index) {
  const effectiveDate = randomDate(new Date('2024-01-01'), new Date('2025-12-31'));
  const expiryDate = new Date(effectiveDate);
  expiryDate.setFullYear(effectiveDate.getFullYear() + randomBetween(1, 3));
  const premiumAmount = randomBetween(1000, 5000000);
  const status = statuses[index % statuses.length];

  return {
    id: crypto.randomUUID(),
    policyNumber: formatPolicyNumber(index),
    policyholderName: policyHolderNames[index % policyHolderNames.length],
    lineOfBusiness: linesOfBusiness[index % linesOfBusiness.length],
    status,
    premiumAmount,
    currency: currencies[index % currencies.length],
    effectiveDate: effectiveDate.toISOString().slice(0, 10),
    expiryDate: expiryDate.toISOString().slice(0, 10),
    region: regions[index % regions.length],
    underwriter: underwriters[index % underwriters.length],
    flaggedForReview: false
  };
}

async function seedDatabase() {
  const policies = Array.from({ length: 200 }, (_, index) => createPolicy(index));
  const payload = { policies };

  await fs.writeFile(outputPath, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`Generated ${policies.length} policies at ${outputPath}`);
}

seedDatabase().catch((error) => {
  console.error('Failed to generate db.json:', error);
  process.exit(1);
});
