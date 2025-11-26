import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  steamId: string;
  username: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('rust_donate_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = () => {
    const mockUser: User = {
      steamId: 'STEAM_0:1:123456789',
      username: 'RustWarrior2024',
      avatar: 'https://cdn.poehali.dev/projects/cb3e8f6c-1b8e-4556-97a9-bb095068a3e1/files/abfdffaa-9ce7-4358-b301-f60d3fc611b1.jpg'
    };
    
    setUser(mockUser);
    localStorage.setItem('rust_donate_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rust_donate_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
