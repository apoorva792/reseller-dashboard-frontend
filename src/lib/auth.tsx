import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from './api';

// Types
type User = {
  customer_id: number;
  customer_email_address: string;
  customer_firstname: string;
  customer_lastname: string;
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<void>;
  logout: () => void;
};

// Create context with a meaningful default value
const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => { throw new Error('AuthContext not initialized') },
  register: async () => { throw new Error('AuthContext not initialized') },
  logout: () => { throw new Error('AuthContext not initialized') },
});

// Provider component - using function declaration for better HMR
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = React.useCallback(async (email: string, password: string): Promise<User> => {
    try {
      const response = await authApi.login({ email, password });
      setUser(response.user);
      
      // Don't auto-navigate; let the Login component determine where to go
      // based on onboarding state
      return response.user;
    } catch (error) {
      throw error;
    }
  }, []);

  const register = React.useCallback(async (data: any) => {
    try {
      await authApi.register(data);
      navigate('/auth/login');
    } catch (error) {
      throw error;
    }
  }, [navigate]);

  const logout = React.useCallback(() => {
    authApi.logout();
    setUser(null);
    navigate('/auth/login');
  }, [navigate]);

  const value = React.useMemo(() => ({
    user,
    isLoading,
    login,
    register,
    logout,
  }), [user, isLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook - using function declaration for better HMR
function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Named exports only - no default exports
export { AuthProvider, useAuth };
export type { User, AuthContextType }; 