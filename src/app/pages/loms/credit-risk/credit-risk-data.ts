export type CreditRiskProductType = 'Retail' | 'Credit Card';

export type CreditRiskStatus = 'Draft' | 'Active' | 'Inactive';

export interface CreditRiskGradeBand {
  grade: string;
  minScore: number;
  maxScore: number;
  recommendation: string;
  enabled: boolean;
}

export interface CreditRiskConfig {
  id: string;
  name: string;
  productType: CreditRiskProductType;
  version: number;
  status: CreditRiskStatus;
  effectiveFrom: string;
  updatedOn: string;
  grades: CreditRiskGradeBand[];
}

let configs: CreditRiskConfig[] = [
  {
    id: 'CFG_2026_000001',
    name: 'Retail Scorecard v1',
    productType: 'Retail',
    version: 1,
    status: 'Active',
    effectiveFrom: '2026-02-03',
    updatedOn: '2026-02-03T11:54:02',
    grades: [],
  },
  {
    id: 'CFG_2026_000002',
    name: 'Retail Scorecard v2 (Draft)',
    productType: 'Retail',
    version: 2,
    status: 'Draft',
    effectiveFrom: '2026-02-19',
    updatedOn: '2026-02-19T15:44:21',
    grades: [],
  },
  {
    id: 'CFG_2026_000003',
    name: 'Credit Card Scorecard v1',
    productType: 'Credit Card',
    version: 1,
    status: 'Active',
    effectiveFrom: '2026-02-03',
    updatedOn: '2026-02-03T11:54:02',
    grades: [],
  },
];

export function getCreditRiskConfigs(): CreditRiskConfig[] {
  return configs;
}

export function getCreditRiskConfigById(
  id: string
): CreditRiskConfig | undefined {
  return configs.find(c => c.id === id);
}

export function getActiveConfigIdForProduct(
  product: CreditRiskProductType
): string | null {
  const active = configs.find(
    c => c.productType === product && c.status === 'Active'
  );
  return active ? active.id : null;
}

export function saveCreditRiskConfig(
  config: Omit<CreditRiskConfig, 'id' | 'version' | 'status' | 'updatedOn'>,
  options?: { mode?: 'create' | 'edit' | 'clone'; baseId?: string }
): CreditRiskConfig {
  const mode = options?.mode ?? 'create';

  if (mode === 'edit' && options?.baseId) {
    const existingIndex = configs.findIndex(c => c.id === options.baseId);
    if (existingIndex !== -1) {
      const existing = configs[existingIndex];
      const updated: CreditRiskConfig = {
        ...existing,
        ...config,
        id: existing.id,
        version: existing.version,
        status: existing.status,
        updatedOn: new Date().toISOString(),
      };
      configs[existingIndex] = updated;
      return updated;
    }
  }

  const numericParts = configs
    .map(c => {
      const match = c.id.match(/(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(n => !Number.isNaN(n));
  const maxSuffix = numericParts.length ? Math.max(...numericParts) : 0;
  const nextSuffix = (maxSuffix + 1).toString().padStart(6, '0');
  const newId = `CFG_2026_${nextSuffix}`;

  const version =
    mode === 'clone' && options?.baseId
      ? (getCreditRiskConfigById(options.baseId)?.version ?? 0) + 1
      : 1;

  const created: CreditRiskConfig = {
    ...config,
    id: newId,
    version,
    status: 'Draft',
    updatedOn: new Date().toISOString(),
  };

  configs = [...configs, created];
  return created;
}

export function approveCreditRiskConfig(id: string): void {
  const target = getCreditRiskConfigById(id);
  if (!target) {
    return;
  }

  const now = new Date().toISOString();

  configs = configs.map(cfg => {
    if (cfg.productType === target.productType) {
      if (cfg.id === id) {
        return { ...cfg, status: 'Active', updatedOn: now };
      }
      return { ...cfg, status: 'Inactive' };
    }
    return cfg;
  });
}

export function rejectCreditRiskConfig(id: string): void {
  const now = new Date().toISOString();

  configs = configs.map(cfg =>
    cfg.id === id ? { ...cfg, status: 'Inactive', updatedOn: now } : cfg
  );
}

export function cloneCreditRiskConfig(id: string): CreditRiskConfig | null {
  const base = getCreditRiskConfigById(id);
  if (!base) {
    return null;
  }
  const cloned = saveCreditRiskConfig(
    {
      name: `${base.name} (Clone)`,
      productType: base.productType,
      effectiveFrom: base.effectiveFrom,
      grades: base.grades,
    },
    { mode: 'clone', baseId: id }
  );
  return cloned;
}

export type CreditRiskAppStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Rejected';

export interface CreditRiskDimensionScore {
  key: string;
  label: string;
  obtained: number;
  max: number;
}

export interface CreditRiskCibSnapshot {
  status: string;
  score: number;
  activeLoans: number;
  dpd90Plus: number;
  overdueAmount: number;
  inquiries6m: number;
}

export interface CreditRiskApplication {
  appId: string;
  product: CreditRiskProductType;
  applicant: string;
  amount: number;
  cibScore: number;
  status: CreditRiskAppStatus;
  updatedOn: string;
  employer: string;
  nid: string;
  tenorMonths: number;
  cib: CreditRiskCibSnapshot;
  dimensions: CreditRiskDimensionScore[];
  totalScore: number;
  grade: string;
  decisionLabel: string;
  missingMandatoryCount: number;
}

const scoringApplications: CreditRiskApplication[] = [
  {
    appId: 'APP_2026_000101',
    product: 'Retail',
    applicant: 'Md. Rahim Uddin',
    amount: 500000,
    cibScore: 780,
    status: 'Draft',
    updatedOn: '2/5/2026',
    employer: 'Ready-Mix Textiles Ltd.',
    nid: '1234567890',
    tenorMonths: 36,
    cib: {
      status: 'Clean',
      score: 780,
      activeLoans: 1,
      dpd90Plus: 0,
      overdueAmount: 0,
      inquiries6m: 1,
    },
    dimensions: [
      { key: 'creditHistory', label: 'Credit History', obtained: 30, max: 30 },
      { key: 'capacity', label: 'Capacity / Income', obtained: 2, max: 25 },
      { key: 'stability', label: 'Stability', obtained: 3, max: 15 },
      { key: 'collateral', label: 'Collateral', obtained: 0, max: 20 },
      { key: 'behavioral', label: 'Behavioral', obtained: 3, max: 10 },
    ],
    totalScore: 38,
    grade: 'B',
    decisionLabel: 'Reject/Refer',
    missingMandatoryCount: 7,
  },
  {
    appId: 'APP_2026_000102',
    product: 'Retail',
    applicant: 'Fatema Akter',
    amount: 1000000,
    cibScore: 550,
    status: 'Draft',
    updatedOn: '-',
    employer: 'Dhaka Bank Limited',
    nid: '1234567891',
    tenorMonths: 48,
    cib: {
      status: 'Watchlist',
      score: 550,
      activeLoans: 2,
      dpd90Plus: 0,
      overdueAmount: 0,
      inquiries6m: 2,
    },
    dimensions: [
      { key: 'creditHistory', label: 'Credit History', obtained: 20, max: 30 },
      { key: 'capacity', label: 'Capacity / Income', obtained: 10, max: 25 },
      { key: 'stability', label: 'Stability', obtained: 5, max: 15 },
      { key: 'collateral', label: 'Collateral', obtained: 10, max: 20 },
      { key: 'behavioral', label: 'Behavioral', obtained: 5, max: 10 },
    ],
    totalScore: 50,
    grade: 'A',
    decisionLabel: 'Approve',
    missingMandatoryCount: 3,
  },
  {
    appId: 'APP_2026_000103',
    product: 'Retail',
    applicant: 'Shahriar Kabir',
    amount: 200000,
    cibScore: 680,
    status: 'Draft',
    updatedOn: '-',
    employer: 'Chittagong Traders',
    nid: '1234567892',
    tenorMonths: 24,
    cib: {
      status: 'Clean',
      score: 680,
      activeLoans: 1,
      dpd90Plus: 0,
      overdueAmount: 0,
      inquiries6m: 0,
    },
    dimensions: [
      { key: 'creditHistory', label: 'Credit History', obtained: 25, max: 30 },
      { key: 'capacity', label: 'Capacity / Income', obtained: 8, max: 25 },
      { key: 'stability', label: 'Stability', obtained: 4, max: 15 },
      { key: 'collateral', label: 'Collateral', obtained: 5, max: 20 },
      { key: 'behavioral', label: 'Behavioral', obtained: 4, max: 10 },
    ],
    totalScore: 46,
    grade: 'A',
    decisionLabel: 'Approve',
    missingMandatoryCount: 4,
  },
  {
    appId: 'APP_2026_000201',
    product: 'Credit Card',
    applicant: 'Nusrat Jahan',
    amount: 100000,
    cibScore: 820,
    status: 'Draft',
    updatedOn: '-',
    employer: 'Bangladesh Civil Service',
    nid: '1234567893',
    tenorMonths: 12,
    cib: {
      status: 'Clean',
      score: 820,
      activeLoans: 0,
      dpd90Plus: 0,
      overdueAmount: 0,
      inquiries6m: 1,
    },
    dimensions: [
      { key: 'creditHistory', label: 'Credit History', obtained: 28, max: 30 },
      { key: 'capacity', label: 'Capacity / Income', obtained: 15, max: 25 },
      { key: 'stability', label: 'Stability', obtained: 10, max: 15 },
      { key: 'collateral', label: 'Collateral', obtained: 0, max: 20 },
      { key: 'behavioral', label: 'Behavioral', obtained: 9, max: 10 },
    ],
    totalScore: 62,
    grade: 'A+',
    decisionLabel: 'Auto Approve',
    missingMandatoryCount: 1,
  },
  {
    appId: 'APP_2026_000202',
    product: 'Credit Card',
    applicant: 'Mahmudul Hasan',
    amount: 50000,
    cibScore: 600,
    status: 'Draft',
    updatedOn: '-',
    employer: 'Grameenphone Ltd.',
    nid: '1234567894',
    tenorMonths: 18,
    cib: {
      status: 'Clean',
      score: 600,
      activeLoans: 1,
      dpd90Plus: 0,
      overdueAmount: 0,
      inquiries6m: 2,
    },
    dimensions: [
      { key: 'creditHistory', label: 'Credit History', obtained: 22, max: 30 },
      { key: 'capacity', label: 'Capacity / Income', obtained: 12, max: 25 },
      { key: 'stability', label: 'Stability', obtained: 6, max: 15 },
      { key: 'collateral', label: 'Collateral', obtained: 0, max: 20 },
      { key: 'behavioral', label: 'Behavioral', obtained: 6, max: 10 },
    ],
    totalScore: 46,
    grade: 'A',
    decisionLabel: 'Approve',
    missingMandatoryCount: 5,
  },
  {
    appId: 'APP_2026_000203',
    product: 'Credit Card',
    applicant: 'Ayesha Sultana',
    amount: 200000,
    cibScore: 0,
    status: 'Draft',
    updatedOn: '-',
    employer: 'Self-employed',
    nid: '1234567895',
    tenorMonths: 24,
    cib: {
      status: 'No Hit',
      score: 0,
      activeLoans: 0,
      dpd90Plus: 0,
      overdueAmount: 0,
      inquiries6m: 0,
    },
    dimensions: [
      { key: 'creditHistory', label: 'Credit History', obtained: 10, max: 30 },
      { key: 'capacity', label: 'Capacity / Income', obtained: 5, max: 25 },
      { key: 'stability', label: 'Stability', obtained: 3, max: 15 },
      { key: 'collateral', label: 'Collateral', obtained: 5, max: 20 },
      { key: 'behavioral', label: 'Behavioral', obtained: 2, max: 10 },
    ],
    totalScore: 25,
    grade: 'C',
    decisionLabel: 'Reject/Refer',
    missingMandatoryCount: 9,
  },
];

export function getCreditRiskApplications(): CreditRiskApplication[] {
  return scoringApplications;
}

export function getCreditRiskApplication(
  appId: string
): CreditRiskApplication | undefined {
  return scoringApplications.find(a => a.appId === appId);
}

export function updateCreditRiskApplicationStatus(
  appId: string,
  status: CreditRiskAppStatus
): void {
  const app = getCreditRiskApplication(appId);
  if (!app) {
    return;
  }
  app.status = status;
  app.updatedOn = new Date().toLocaleDateString('en-US');
}
