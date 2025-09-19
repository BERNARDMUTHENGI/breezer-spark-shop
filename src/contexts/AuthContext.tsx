import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interface for the User object stored in the context
interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null; 
  isAdmin: boolean; 
}

// Interface for the shape of the authentication context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null; 
  login: (userData: User, token: string) => void;
  logout: () => void;
}

// Create the AuthContext with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Expiry time in ms → 5 hours
const TOKEN_EXPIRY_MS = 5 * 60 * 60 * 1000; 
const ADMIN_TOKEN_EXPIRY_MS = 12 * 60 * 60 * 1000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // On component mount, load user and token from local storage + check expiry
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedExpiry = localStorage.getItem('tokenExpiry');

    if (storedUser && storedToken && storedExpiry) {
      const now = Date.now();
      if (now < parseInt(storedExpiry, 10)) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          logout();
        }
      } else {
        // Token expired
        logout();
      }
    }
  }, []);

  // Function to handle user login
  const login = (userData: User, authToken: string) => {
    const expiryTime = Date.now() + (userData.isAdmin ? ADMIN_TOKEN_EXPIRY_MS : TOKEN_EXPIRY_MS);

    setUser(userData);
    setIsAuthenticated(true);
    setToken(authToken);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    localStorage.setItem('tokenExpiry', expiryTime.toString());
  };

  // Function to handle user logout
  // Function to handle user logout
const logout = () => {
  const wasAdmin = user?.isAdmin; // store before clearing

  setUser(null);
  setIsAuthenticated(false);
  setToken(null);

  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');

  if (wasAdmin) {
    window.location.href = "/admin-login";
  } else {
    window.location.href = "/login";
  }
};


  const contextValue = {
    user,
    isAuthenticated,
    token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
