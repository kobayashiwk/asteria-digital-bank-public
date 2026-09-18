import { getAccountsForUser } from '../db.js';
import { fetchPartnerNote } from './partner.js';

export async function handleAssistantMessage({ userId, message }) {
  const lower = String(message ?? '').toLowerCase();
  const accounts = getAccountsForUser(userId);

  if (lower.includes('残高') || lower.includes('balance')) {
    return {
      answer: `現在の口座残高は ${accounts.map(a => `${a.displayName} ¥${Number(a.balance).toLocaleString('ja-JP')}`).join('、')} です。`,
      events: [{ name: 'read_accounts', result: 'completed' }]
    };
  }

  if (lower.includes('メモ') || lower.includes('memo') || lower.includes('asteria pay')) {
    const note = await fetchPartnerNote();
    return {
      answer: `${note.title}: ${note.content}`,
      events: [{ name: 'retrieve_partner_note', result: 'completed' }]
    };
  }

  return {
    answer: '残高照会や登録先メモの説明をお手伝いできます。',
    events: []
  };
}
