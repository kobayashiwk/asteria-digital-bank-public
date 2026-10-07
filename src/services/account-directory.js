import { getAccountById } from '../db.js';

export function resolveDestinationAccount(accountId) {
  return getAccountById(accountId);
}
