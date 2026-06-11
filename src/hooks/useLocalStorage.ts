import { useEffect, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';

export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => loadFromStorage<T>(key, fallback));

  useEffect(() => {
    saveToStorage(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
