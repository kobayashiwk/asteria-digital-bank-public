import { getAccountById, getUserById } from '../db.js';

export function resolveDestinationAccount(accountId) {
  const account = getAccountById(accountId);
  if (!account) return null;

  const owner = getUserById(account.userId);
  const beneficiaryName = account.displayName === 'Asteria Pay'
    ? account.displayName
    : (owner?.name ?? account.displayName);

  return {
    ...account,
    beneficiaryName
  };
}
