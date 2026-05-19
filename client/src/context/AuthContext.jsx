import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/api.js";
import { clearSession, readSession, saveSession } from "../utils/sessionStorage.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(readSession);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const verifyProfile = async () => {
      if (!session.token) {
        setBooting(false);
        return;
      }

      try {
        const { user } = await authService.profile();
        setSession((current) => ({ ...current, user }));
      } catch (_error) {
        clearSession();
        setSession({ user: null, token: null });
      } finally {
        setBooting(false);
      }
    };

    verifyProfile();
  }, []);

  const persist = (nextSession) => {
    setSession(nextSession);
    saveSession(nextSession);
  };

  const login = async (payload) => {
    const nextSession = await authService.login(payload);
    persist(nextSession);
    toast.success(`Welcome back, ${nextSession.user.name}`);
  };

  const register = async (payload) => {
    const nextSession = await authService.register(payload);
    persist(nextSession);
    toast.success("Store created successfully");
  };

  const logout = () => {
    clearSession();
    setSession({ user: null, token: null });
    toast.success("Logged out");
  };

  const value = useMemo(
    () => ({
      booting,
      isAuthenticated: Boolean(session.token),
      login,
      logout,
      register,
      token: session.token,
      user: session.user
    }),
    [booting, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
