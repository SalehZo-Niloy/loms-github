export type KycRole = 'Admin' | 'Branch' | 'Checker';

export type KycProductType = 'Retail' | 'CreditCard';

export type KycSetupStatus = 'Active' | 'Inactive';

export type KycStatus =
  | 'Pending'
  | 'In Progress'
  | 'Submitted'
  | 'Approved'
  | 'Rejected';

export interface KycSetup {
  id: string;
  name: string;
  product: KycProductType;
  status: KycSetupStatus;
  effectiveDate: string;
}

export interface KycWorklistItem {
  appId: string;
  product: KycProductType;
  applicant: string;
  kycStatus: KycStatus;
}

export interface KycProfile {
  appId: string;
  applicant: string;
  product: KycProductType;
  riskScore: number;
}

const setups: KycSetup[] = [
  {
    id: 'KYCSET_2026_000001',
    name: 'Bank Standard Retail KYC v2',
    product: 'Retail',
    status: 'Active',
    effectiveDate: '2026-01-01',
  },
  {
    id: 'KYCSET_2026_000002',
    name: 'Bank Standard Card KYC v2',
    product: 'CreditCard',
    status: 'Active',
    effectiveDate: '2026-01-01',
  },
];

let branchWorklist: KycWorklistItem[] = [
  {
    appId: 'APP_2026_000501',
    product: 'Retail',
    applicant: 'Md. Rahim Uddin',
    kycStatus: 'Pending',
  },
  {
    appId: 'APP_2026_000502',
    product: 'Retail',
    applicant: 'Sharmin Akter',
    kycStatus: 'Pending',
  },
  {
    appId: 'APP_2026_000503',
    product: 'Retail',
    applicant: 'Nazmul Hasan',
    kycStatus: 'Pending',
  },
  {
    appId: 'APP_2026_000504',
    product: 'CreditCard',
    applicant: 'Farzana Rahman',
    kycStatus: 'Pending',
  },
  {
    appId: 'APP_2026_000505',
    product: 'CreditCard',
    applicant: 'Shahriar Hossain',
    kycStatus: 'Pending',
  },
  {
    appId: 'APP_2026_000506',
    product: 'CreditCard',
    applicant: 'Tanvir Ahmed',
    kycStatus: 'Pending',
  },
];

let checkerWorklist: KycWorklistItem[] = [...branchWorklist];

let profiles: KycProfile[] = [];

export function getKycSetups(): KycSetup[] {
  return setups;
}

export function getKycSetupById(id: string): KycSetup | undefined {
  return setups.find(s => s.id === id);
}

export function cloneKycSetup(id: string): KycSetup | null {
  const base = getKycSetupById(id);
  if (!base) {
    return null;
  }
  const numericParts = setups
    .map(s => {
      const match = s.id.match(/(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(n => !Number.isNaN(n));
  const maxSuffix = numericParts.length ? Math.max(...numericParts) : 0;
  const nextSuffix = (maxSuffix + 1).toString().padStart(6, '0');
  const newId = `KYCSET_2026_${nextSuffix}`;

  const today = new Date().toISOString().slice(0, 10);

  const cloned: KycSetup = {
    ...base,
    id: newId,
    name: `${base.name} (Copy)`,
    status: 'Active',
    effectiveDate: today,
  };

  setups.push(cloned);
  return cloned;
}

export function setActiveKycSetup(id: string): void {
  const target = getKycSetupById(id);
  if (!target) {
    return;
  }
  for (let i = 0; i < setups.length; i += 1) {
    const s = setups[i];
    if (s.product === target.product) {
      setups[i] = {
        ...s,
        status: s.id === id ? 'Active' : 'Inactive',
        effectiveDate:
          s.id === id ? new Date().toISOString().slice(0, 10) : s.effectiveDate,
      };
    }
  }
}

export function getActiveSetupIdForProduct(
  product: KycProductType
): string | null {
  const active = setups.find(
    s => s.product === product && s.status === 'Active'
  );
  return active ? active.id : null;
}

export function getBranchWorklist(): KycWorklistItem[] {
  return branchWorklist;
}

export function getCheckerWorklist(): KycWorklistItem[] {
  return checkerWorklist;
}

export function getWorklistItem(appId: string): KycWorklistItem | undefined {
  return branchWorklist.find(i => i.appId === appId);
}

export function ensureProfile(appId: string): KycProfile | null {
  const base = getWorklistItem(appId);
  if (!base) {
    return null;
  }
  let profile = profiles.find(p => p.appId === appId);
  if (!profile) {
    profile = {
      appId: base.appId,
      applicant: base.applicant,
      product: base.product,
      riskScore: 0,
    };
    profiles = [...profiles, profile];
  }
  return profile;
}

export function updateKycStatus(
  appId: string,
  status: KycStatus
): void {
  branchWorklist = branchWorklist.map(item =>
    item.appId === appId ? { ...item, kycStatus: status } : item
  );
  checkerWorklist = checkerWorklist.map(item =>
    item.appId === appId ? { ...item, kycStatus: status } : item
  );
}

export function updateRiskScore(appId: string, score: number): void {
  profiles = profiles.map(p =>
    p.appId === appId ? { ...p, riskScore: score } : p
  );
}
