import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../utils/mockData';

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
    setUsers(mockUsers);
    
    // Check for saved session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would call an API
    // For demo purposes, we'll just check if the email exists and any password is accepted
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      const authUser: AuthUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      };
      
      setCurrentUser(authUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(authUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
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