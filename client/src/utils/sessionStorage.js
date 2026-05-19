const storageKey = "stockflow.session";

export const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || { user: null, token: null };
  } catch (_error) {
    return { user: null, token: null };
  }
};

export const saveSession = (session) => {
  localStorage.setItem(storageKey, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(storageKey);
};

export const getStoredToken = () => readSession().token;
