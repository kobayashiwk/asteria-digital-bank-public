import { getAccountsForUser, getOwnedAccount, getTransfersForUser } from '../db.js';

export function findAccountsForCustomer(customerId) {
  return getAccountsForUser(customerId);
}

export function findAccountDetail(customerId, accountId) {
  return getOwnedAccount(customerId, accountId);
}

export function findRecentActivityForCustomer(customerId) {
  return getTransfersForUser(customerId);
}
