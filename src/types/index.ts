export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Group {
  id: string;
  name: string;
  members: string[]; // array of user UIDs
  ownerId: string;
  inviteCode: string;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  description: string;
  amount: number;
  paidBy: string; // user UID
  split: Record<string, number>; // user UID -> amount owed
  category?: string;
  receiptUrl?: string;
  createdAt: Date;
}

export interface Debt {
  from: string; // user UID of who owes
  to: string; // user UID of who is owed
  amount: number;
}
