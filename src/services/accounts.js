import { getAccountsForUser, getOwnedAccount, getTransfersForUser } from '../db.js';

function presentAccount(account) {
  return account ? {
    id: account.id,
    user_id: account.userId,
    account_number: account.accountNumber,
    account_type: account.accountType,
    display_name: account.displayName,
    balance: account.balance
  } : null;
}

function presentTransfer(row) {
  return {
    id: row.id,
    from_account_id: row.fromAccountId,
    beneficiary_name: row.beneficiaryName,
    amount: row.amount,
    status: row.status,
    created_at: row.createdAt,
    memo: row.memo
  };
}

export function listAccountsForUser(userId) { return getAccountsForUser(userId).map(presentAccount); }
export function getAccountForUser(userId, accountId) { return presentAccount(getOwnedAccount(userId, accountId)); }
export function recentActivityForUser(userId) { return getTransfersForUser(userId).map(presentTransfer); }
