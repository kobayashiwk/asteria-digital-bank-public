export async function fetchPartnerNote() {
  const url = process.env.PARTNER_CONTENT_URL;
  if (!url) {
    return {
      title: 'Asteria Pay',
      content: '請求書の照会に利用する登録先です。'
    };
  }

  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(3000)
  });
  if (!response.ok) throw new Error(`Partner service returned ${response.status}`);
  return response.json();
}
