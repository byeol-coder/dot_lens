export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const uid = (prefix = 'id') => `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
export const todayISO = () => new Date().toISOString().slice(0, 10);
export const monthKey = (date: string) => date.slice(0, 7);
