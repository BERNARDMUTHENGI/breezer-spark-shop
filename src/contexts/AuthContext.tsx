import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interface for the User object stored in the context
interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null; // Made phone nullable
  isAdmin: boolean; // Added isAdmin
}

// Interface for the shape of the authentication context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null; // Added token to the context type
  login: (userData: User, token: string) => void;
  logout: () => void;
}

// Create the AuthContext with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap your application and provide auth context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null); // State to hold the authentication token

  // On component mount, try to load user data and token from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        const parsedUser: User = JSON.parse(storedUser); // Explicitly type for safety
        setUser(parsedUser);
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user or token:", error);
        // Clear invalid storage to prevent continuous errors
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle user login
  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setIsAuthenticated(true);
    setToken(authToken); // Set the token in state
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken); // Store token in local storage
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setToken(null); // Clear the token from state
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Remove token from local storage
  };

  // The value provided to consumers of this context
  const contextValue = {
    user,
    isAuthenticated,
    token, // Expose token through the context
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
