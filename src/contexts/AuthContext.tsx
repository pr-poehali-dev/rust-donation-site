import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  steamId: string;
  username: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (steamId: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STEAM_PROFILE_API = 'https://functions.poehali.dev/f154cc63-1ece-41e7-8114-e727e1a06e24';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('rust_donate_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (steamId: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await fetch(`${STEAM_PROFILE_API}?steamid=${encodeURIComponent(steamId)}`);
      
      if (!response.ok) {
        setLoading(false);
        return false;
      }
      
      const data = await response.json();
      
      const userData: User = {
        steamId: data.steamId,
        username: data.username,
        avatar: data.avatar
      };
      
      setUser(userData);
      localStorage.setItem('rust_donate_user', JSON.stringify(userData));
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Steam login error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rust_donate_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}