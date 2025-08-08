import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../utils/mockData';
import { supabase } from '../lib/supabaseClient.ts'

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
}

interface UserContextType {
  currentUser: AuthUser | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUser: (id: string) => User | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        const user = data.user;
        const authUser: AuthUser = {
          id: user.id,
          name: user.user_metadata?.name || user.email || '',
          email: user.email || '',
          role: user.user_metadata?.role || 'employee',
          avatar: user.user_metadata?.avatar_url || undefined,
        };
        setCurrentUser(authUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(authUser));
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUser');
      }
    };
  
    checkSession();
  }, []);
  

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
    if (error || !data.user) {
      return false;
    }
  
    const user = data.user;
    const authUser: AuthUser = {
      id: user.id,
      name: user.user_metadata?.name || user.email || '',
      email: user.email || '',
      role: user.user_metadata?.role || 'employee',
      avatar: user.user_metadata?.avatar_url || undefined,
    };
  
    setCurrentUser(authUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(authUser));
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };
  

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substring(2, 10),
      createdAt: new Date(),
    };
    
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id 
          ? { ...user, ...updates } 
          : user
      )
    );

    // If updating the current user, update the auth state as well
    if (currentUser && currentUser.id === id) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    
    // If deleting the current user, log them out
    if (currentUser && currentUser.id === id) {
      logout();
    }
  };

  const getUser = (id: string): User | undefined => {
    return users.find(user => user.id === id);
  };

  return (
    <UserContext.Provider 
      value={{ 
        currentUser, 
        users, 
        login, 
        logout, 
        isAuthenticated,
        addUser,
        updateUser,
        deleteUser,
        getUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};