let state;
const clone = value => structuredClone(value);

export async function initDatabase() {
  state = {
    users: [
      { id: 1, username: 'yamada', name: '山田 太郎', initials: '山田' },
      { id: 2, username: 'sato', name: '佐藤 美咲', initials: '佐藤' }
    ],
    accounts: [
      { id: 101, userId: 1, accountNumber: '1234567', accountType: '普通預金', displayName: 'メイン口座', balance: 1248500 },
      { id: 102, userId: 1, accountNumber: '1234987', accountType: '普通預金', displayName: '日常決済口座', balance: 100000 },
      { id: 201, userId: 2, accountNumber: '7654321', accountType: '普通預金', displayName: 'メイン口座', balance: 8420100 },
      { id: 999, userId: 2, accountNumber: '9000001', accountType: '普通預金', displayName: 'Asteria Pay', balance: 5000000 }
    ],
    transfers: [
      { id: 1, fromAccountId: 101, toAccountId: 201, beneficiaryName: '佐藤 美咲', amount: 32000, status: 'COMPLETED', createdAt: '2026-09-16T02:25:00Z', memo: '立替精算' },
      { id: 2, fromAccountId: 101, toAccountId: null, beneficiaryName: 'TOKYO MOBILE', amount: 8680, status: 'COMPLETED', createdAt: '2026-09-15T00:10:00Z', memo: '通信料金' },
      { id: 3, fromAccountId: 101, toAccountId: null, beneficiaryName: 'ASTERIA CARD', amount: 54210, status: 'COMPLETED', createdAt: '2026-09-12T03:35:00Z', memo: 'カード利用' },
      { id: 4, fromAccountId: 201, toAccountId: null, beneficiaryName: '給与', amount: 420000, status: 'COMPLETED', createdAt: '2026-09-10T01:00:00Z', memo: '給与' }
    ],
    dailyUsage: { 1: 0, 2: 0 },
    nextTransferId: 5
  };
}

export function getUserByUsername(username) { return clone(state.users.find(u => u.username === username) ?? null); }
export function getUserById(id) { return clone(state.users.find(u => u.id === Number(id)) ?? null); }
export function getAccountsForUser(userId) { return clone(state.accounts.filter(a => a.userId === Number(userId))); }
export function getAccountById(id) { return clone(state.accounts.find(a => a.id === Number(id)) ?? null); }
export function getOwnedAccount(userId, accountId) { return clone(state.accounts.find(a => a.id === Number(accountId) && a.userId === Number(userId)) ?? null); }
export function getTransfersFromAccount(accountId, limit = 10) { return clone(state.transfers.filter(t => t.fromAccountId === Number(accountId)).sort((a,b) => b.id - a.id).slice(0, limit)); }
export function getTransfersForUser(userId, limit = 8) {
  const ids = new Set(state.accounts.filter(a => a.userId === Number(userId)).map(a => a.id));
  return clone(state.transfers.filter(t => ids.has(t.fromAccountId)).sort((a,b) => b.id - a.id).slice(0, limit));
}
export function getDailyUsage(userId) { return Number(state.dailyUsage[Number(userId)] ?? 0); }
export function addDailyUsage(userId, amount) { state.dailyUsage[Number(userId)] = getDailyUsage(userId) + Number(amount); }
export function adjustBalance(accountId, delta) {
  const account = state.accounts.find(a => a.id === Number(accountId));
  if (!account) return false;
  account.balance += Number(delta);
  return true;
}
export function addTransfer({ fromAccountId, toAccountId, beneficiaryName, amount, memo }) {
  const row = {
    id: state.nextTransferId++,
    fromAccountId: Number(fromAccountId),
    toAccountId: toAccountId == null ? null : Number(toAccountId),
    beneficiaryName,
    amount: Number(amount),
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
    memo: String(memo || '')
  };
  state.transfers.push(row);
  return clone(row);
}
