export type QueryPriority = 'Low' | 'Medium' | 'High';

export type QueryStatus = 'Open' | 'Responded' | 'Closed';

export type QueryCategory = 'KYC' | 'Income' | 'Operational' | 'Other';

export interface QueryUser {
  id: string;
  name: string;
  shortLabel: string;
}

export interface LoanApp {
  id: string;
  appNo: string;
  customerName: string;
  product: string;
  amount: number;
  status: string;
  branch: string;
}

export interface QueryMessage {
  id: string;
  queryId: string;
  senderId: string;
  senderLabel: string;
  role: 'QUESTION' | 'RESPONSE';
  text: string;
  createdAt: string;
}

export interface QueryItem {
  id: string;
  title: string;
  category: QueryCategory;
  priority: QueryPriority;
  status: QueryStatus;
  dueAt: string;
  loanAppId: string;
  createdById: string;
  recipientIds: string[];
  initialMessageId: string;
}

export const loanApps: LoanApp[] = [
  {
    id: 'la1',
    appNo: 'LN-2023-001',
    customerName: 'Md. Rahim Uddin',
    product: 'Home Loan',
    amount: 500000,
    status: 'Underwriting',
    branch: 'Dhaka Main Branch',
  },
  {
    id: 'la2',
    appNo: 'LN-2023-002',
    customerName: 'Sharmin Akter',
    product: 'Car Loan',
    amount: 35000,
    status: 'Approved',
    branch: 'Gulshan Branch',
  },
  {
    id: 'la3',
    appNo: 'LN-2023-003',
    customerName: 'Abir Traders',
    product: 'Business Loan',
    amount: 1200000,
    status: 'Processing',
    branch: 'Chattogram Branch',
  },
  {
    id: 'la4',
    appNo: 'LN-2023-004',
    customerName: 'Nazmul Hasan',
    product: 'Personal Loan',
    amount: 10000,
    status: 'New',
    branch: 'Uttara Branch',
  },
  {
    id: 'la5',
    appNo: 'LN-2023-005',
    customerName: 'Farzana Rahman',
    product: 'Home Loan',
    amount: 450000,
    status: 'Underwriting',
    branch: 'Motijheel Branch',
  },
  {
    id: 'la6',
    appNo: 'LN-2023-006',
    customerName: 'Shahriar Hossain',
    product: 'Car Loan',
    amount: 25000,
    status: 'Rejected',
    branch: 'Sylhet Branch',
  },
  {
    id: 'la7',
    appNo: 'LN-2023-007',
    customerName: 'Desh Garments Ltd',
    product: 'Business Loan',
    amount: 800000,
    status: 'Processing',
    branch: 'Narayanganj Branch',
  },
  {
    id: 'la8',
    appNo: 'LN-2023-008',
    customerName: 'Tanvir Ahmed',
    product: 'Personal Loan',
    amount: 5000,
    status: 'Approved',
    branch: 'Khulna Branch',
  },
];

export const users: QueryUser[] = [
  { id: 'alice', name: 'Rahim CRO (CRO)', shortLabel: 'Rahim CRO' },
  { id: 'bob', name: 'Karim Branch (BO)', shortLabel: 'Karim Branch' },
  { id: 'charlie', name: 'Hasan RM (RM)', shortLabel: 'Hasan RM' },
  { id: 'dave', name: 'Sadia Ops (OPS)', shortLabel: 'Sadia Ops' },
  { id: 'eve', name: 'Nabila Collateral (COL)', shortLabel: 'Nabila Collateral' },
  { id: 'frank', name: 'Rafi CIB (CIB)', shortLabel: 'Rafi CIB' },
  { id: 'grace', name: 'Mahmud Legal (LEGAL)', shortLabel: 'Mahmud Legal' },
  { id: 'hank', name: 'Imran IT (IT)', shortLabel: 'Imran IT' },
];

let queries: QueryItem[] = [
  {
    id: 'q1770181004853',
    title: 'Missing KYC document for Md. Rahim Uddin',
    category: 'KYC',
    priority: 'Low',
    status: 'Responded',
    dueAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    loanAppId: 'la1',
    createdById: 'alice',
    recipientIds: ['bob'],
    initialMessageId: 'm1',
  },
  {
    id: 'q1770181004854',
    title: 'Income proof clarification for Sharmin Akter',
    category: 'Income',
    priority: 'Medium',
    status: 'Open',
    dueAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    loanAppId: 'la2',
    createdById: 'bob',
    recipientIds: ['alice'],
    initialMessageId: 'm2',
  },
];

let messages: QueryMessage[] = [
  {
    id: 'm1',
    queryId: 'q1770181004853',
    senderId: 'alice',
    senderLabel: 'Rahim CRO',
    role: 'QUESTION',
    text: 'Please confirm KYC completeness for Md. Rahim Uddin.',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'm1r',
    queryId: 'q1770181004853',
    senderId: 'bob',
    senderLabel: 'Karim Branch',
    role: 'RESPONSE',
    text: 'KYC verified and updated in the system.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'm2',
    queryId: 'q1770181004854',
    senderId: 'bob',
    senderLabel: 'Karim Branch',
    role: 'QUESTION',
    text: 'Need clarification on variable income for Sharmin Akter.',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

export function getUsers(): QueryUser[] {
  return users;
}

export function getLoanApps(): LoanApp[] {
  return loanApps;
}

export function getQueries(): QueryItem[] {
  return queries;
}

export function getMessagesForQuery(queryId: string): QueryMessage[] {
  return messages.filter(m => m.queryId === queryId);
}

export function getQueriesForUser(userId: string): QueryItem[] {
  return queries.filter(
    q => q.createdById === userId || q.recipientIds.includes(userId)
  );
}

function generateId(prefix: string): string {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export interface CreateQueryInput {
  title: string;
  category: QueryCategory;
  priority: QueryPriority;
  loanAppId: string;
  createdById: string;
  recipientIds: string[];
  initialMessage: string;
  slaHours: number;
}

export function createQuery(input: CreateQueryInput): QueryItem {
  const id = generateId('q');
  const now = new Date();
  const due = new Date(now.getTime() + input.slaHours * 60 * 60 * 1000);
  const initialMessageId = generateId('m');

  const query: QueryItem = {
    id,
    title: input.title,
    category: input.category,
    priority: input.priority,
    status: 'Open',
    dueAt: due.toISOString(),
    loanAppId: input.loanAppId,
    createdById: input.createdById,
    recipientIds: input.recipientIds,
    initialMessageId,
  };

  const creator = users.find(u => u.id === input.createdById);

  const message: QueryMessage = {
    id: initialMessageId,
    queryId: id,
    senderId: input.createdById,
    senderLabel: creator ? creator.shortLabel : input.createdById,
    role: 'QUESTION',
    text: input.initialMessage,
    createdAt: now.toISOString(),
  };

  queries = [query, ...queries];
  messages = [message, ...messages];

  return query;
}

export function addResponse(
  queryId: string,
  senderId: string,
  text: string
): QueryMessage | null {
  const query = queries.find(q => q.id === queryId);
  if (!query) {
    return null;
  }
  const sender = users.find(u => u.id === senderId);
  const message: QueryMessage = {
    id: generateId('m'),
    queryId,
    senderId,
    senderLabel: sender ? sender.shortLabel : senderId,
    role: 'RESPONSE',
    text,
    createdAt: new Date().toISOString(),
  };
  messages = [...messages, message];
  query.status = 'Responded';
  return message;
}

export function closeQuery(queryId: string): QueryItem | null {
  const query = queries.find(q => q.id === queryId);
  if (!query) {
    return null;
  }
  query.status = 'Closed';
  return query;
}
