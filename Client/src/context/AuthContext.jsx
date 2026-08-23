import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { loginUser, getCurrentUser, logoutUser } from "../api/authApi.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const response = await loginUser({
      email,
      password,
    });

    const loggedInUser = response.data.data.user;
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    await logoutUser();

    setUser(null);
  };

  const checkAuth = async () => {
    try {
      const response = await getCurrentUser();

      setUser(response.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);