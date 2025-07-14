import type { Expense, UserProfile, Debt } from '@/types';

export function calculateDebts(expenses: Expense[], members: UserProfile[]): Debt[] {
  if (members.length === 0 || expenses.length === 0) {
    return [];
  }

  const balances: { [key: string]: number } = {};
  members.forEach(member => {
    balances[member.uid] = 0;
  });

  expenses.forEach(expense => {
    if(balances[expense.paidBy] !== undefined) {
        balances[expense.paidBy] += expense.amount;
    }
    
    Object.entries(expense.split).forEach(([borrowerId, amount]) => {
      if(balances[borrowerId] !== undefined) {
        balances[borrowerId] -= amount;
      }
    });
  });

  const debtors = Object.entries(balances)
    .filter(([, balance]) => balance < -0.01)
    .sort((a, b) => a[1] - b[1]);

  const creditors = Object.entries(balances)
    .filter(([, balance]) => balance > 0.01)
    .sort((a, b) => b[1] - a[1]);

  const debts: Debt[] = [];
  
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtorId = debtors[i][0];
    let debtorBalance = debtors[i][1];
    const creditorId = creditors[j][0];
    let creditorBalance = creditors[j][1];

    const amount = Math.min(-debtorBalance, creditorBalance);

    debts.push({ from: debtorId, to: creditorId, amount });

    debtors[i][1] += amount;
    creditors[j][1] -= amount;

    if (Math.abs(debtors[i][1]) < 0.01) {
      i++;
    }
    if (Math.abs(creditors[j][1]) < 0.01) {
      j++;
    }
  }

  return debts;
}
