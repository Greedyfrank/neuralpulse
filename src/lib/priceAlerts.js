// Browser-local price alerts, replacing the base44 PriceAlert entity.
// Alerts are stored per-device in localStorage (no account, no server).

const KEY = "neuralpulse_price_alerts";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(alerts) {
  try {
    localStorage.setItem(KEY, JSON.stringify(alerts));
  } catch {
    /* storage full / unavailable — ignore */
  }
}

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `a_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}

// Newest first, matching the old list("-created_date", ...) ordering.
export function listAlerts() {
  return read().sort((a, b) => (b.created_date || "").localeCompare(a.created_date || ""));
}

export function createAlert(data) {
  const alerts = read();
  const alert = {
    id: newId(),
    created_date: new Date().toISOString(),
    status: "active",
    ...data,
  };
  alerts.push(alert);
  write(alerts);
  return alert;
}

export function deleteAlert(id) {
  write(read().filter((a) => a.id !== id));
}
