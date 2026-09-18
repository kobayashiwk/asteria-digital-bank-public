const $ = selector => document.querySelector(selector);
const yen = value => `¥${Number(value).toLocaleString('ja-JP')}`;
const toast = (message, type = '') => {
  const element = $('#toast');
  element.textContent = message;
  element.className = `toast show ${type}`;
  setTimeout(() => element.className = 'toast', 3200);
};

async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(payload.message || payload.error || 'Request failed'), { status: response.status, body: payload });
  return payload;
}

async function loadDashboard() {
  const data = await api('/api/dashboard');
  $('#headerName').textContent = data.user.name;
  $('#avatar').textContent = data.user.initials;
  $('#greeting').textContent = `こんにちは、${data.user.name}さん`;
  const total = data.accounts.reduce((sum, account) => sum + Number(account.balance), 0);
  $('#totalBalance').textContent = yen(total);
  $('#accounts').innerHTML = data.accounts.map(account => `<div class="account-row"><div><strong>${account.display_name}</strong><div class="small">${account.account_type} • ${account.account_number}</div></div><div style="text-align:right"><strong>${yen(account.balance)}</strong><div><a href="/account.html?id=${account.id}" class="small">詳細を見る</a></div></div></div>`).join('');
  $('#fromAccount').innerHTML = data.accounts.map(account => `<option value="${account.id}">${account.display_name} • ${account.account_number} (${yen(account.balance)})</option>`).join('');
  $('#activity').innerHTML = data.activity.map(row => `<tr><td>${new Date(row.created_at).toLocaleDateString('ja-JP')}</td><td><strong>${row.beneficiary_name}</strong><div class="small">${row.memo || '—'}</div></td><td><span class="status">完了</span></td><td class="amount">-${yen(row.amount)}</td></tr>`).join('') || '<tr><td colspan="4">履歴はありません</td></tr>';
  $('#usageText').textContent = yen(data.transferUsage);
  $('#limitText').textContent = `/ ${yen(data.dailyLimit)}`;
  $('#usageMeter').style.width = `${Math.min(100, data.transferUsage / data.dailyLimit * 100)}%`;
}

async function boot() {
  try {
    await api('/api/me');
    $('#login').hidden = true;
    $('#app').hidden = false;
    await loadDashboard();
  } catch {
    $('#login').hidden = false;
    $('#app').hidden = true;
  }
}

$('#loginForm').addEventListener('submit', async event => {
  event.preventDefault();
  try {
    await api('/api/login', { method: 'POST', body: JSON.stringify({ username: $('#username').value, accessCode: $('#accessCode').value }) });
    await boot();
  } catch (error) {
    toast('ログインできませんでした。', 'bad');
  }
});

$('#transferForm').addEventListener('submit', async event => {
  event.preventDefault();
  try {
    await api('/api/transfers', { method: 'POST', body: JSON.stringify({
      fromAccountId: Number($('#fromAccount').value),
      toAccountId: Number($('#toAccount').value),
      amount: Number($('#amount').value),
      memo: $('#memo').value
    }) });
    toast('振込が完了しました。', 'good');
    await loadDashboard();
  } catch (error) {
    toast(`${error.body?.error || 'ERROR'}: ${error.message}`, 'bad');
  }
});

$('#logoutBtn').addEventListener('click', async () => {
  await api('/api/logout', { method: 'POST' });
  location.reload();
});

$('#chatSend').addEventListener('click', sendChat);
$('#chatInput').addEventListener('keydown', event => { if (event.key === 'Enter') sendChat(); });

async function sendChat() {
  const input = $('#chatInput');
  const message = input.value.trim();
  if (!message) return;
  const chat = $('#chat');
  chat.insertAdjacentHTML('beforeend', `<div class="bubble user">${escapeHtml(message)}</div>`);
  input.value = '';
  try {
    const result = await api('/api/assistant', { method: 'POST', body: JSON.stringify({ message }) });
    const events = (result.events || []).map(event => `<div class="tool-event">${escapeHtml(event.name)} → ${escapeHtml(event.result)}</div>`).join('');
    chat.insertAdjacentHTML('beforeend', `<div class="bubble ai">${escapeHtml(result.answer)}${events}</div>`);
    await loadDashboard();
  } catch (error) {
    toast(error.message, 'bad');
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}

boot();
