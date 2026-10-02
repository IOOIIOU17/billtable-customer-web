// delivery_time comes back as a naive "YYYY-MM-DD HH:MM[:SS]" string (LA
// wall-clock). Safari cannot parse the space form, so swap in a "T" first.
export function parsePartyTime(value) {
  if (!value) return null;
  const d = new Date(String(value).replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? null : d;
}

// A party is "over" 24h after its date/time -- same rule as the native app
// and the server's chat cleanup. Map, Invite and Chat close at that point.
export function isPartyOver(value) {
  const d = parsePartyTime(value);
  return !!d && Date.now() > d.getTime() + 24 * 60 * 60 * 1000;
}

export function formatPartyWhen(value) {
  const d = parsePartyTime(value);
  if (!d) return value || '';
  return `${d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}, ${d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;
}

export function formatPartyDate(value) {
  const d = parsePartyTime(value);
  return d ? d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : '';
}
