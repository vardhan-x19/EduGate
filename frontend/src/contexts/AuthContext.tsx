import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'creator' | 'taker';

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    role?: UserRole;
  };
  role?: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  session: any | null;
  userRole: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock user for demo - replace with actual Supabase auth
  useEffect(() => {
    const mockUser: AuthUser = {
      id: "1",
      email: "user@example.com",
      user_metadata: {
        name: "Demo User",
        role: localStorage.getItem('userRole') as UserRole || 'taker'
      }
    };
    
    setUser(mockUser);
    setUserRole(localStorage.getItem('userRole') as UserRole || 'taker');
    setLoading(false);
  }, []);

  const signOut = async () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('userRole');
  };

  const handleSetUserRole = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
    
    // Update mock user
    if (user) {
      setUser({
        ...user,
        user_metadata: {
          ...user.user_metadata,
          role
        }
      });
    }
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    signOut,
    setUserRole: handleSetUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};