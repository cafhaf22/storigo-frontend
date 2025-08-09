import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../utils/mockData';
import { supabase } from '../lib/supabaseClient'; // ⚠️ sin ".ts" para evitar warnings en Vite

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  businessName?: string;
}

interface UserContextType {
  currentUser: AuthUser | null;
  currentOrganizationId: string | null;
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
  const [currentOrganizationId, setCurrentOrganizationId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const authUser = mapAuthUser(data.user);
        setCurrentUser(authUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(authUser));

        // Asegurar que el usuario tenga una organización
        const orgId = await ensureOrganizationForUser(authUser);
        setCurrentOrganizationId(orgId);
        localStorage.setItem('currentOrganizationId', orgId ?? '');
      } else {
        clearAuthState();
      }
    };
    checkSession();
  }, []);

  const mapAuthUser = (user: any): AuthUser => ({
    id: user.id,
    name: user.user_metadata?.name || user.email || '',
    email: user.email || '',
    role: (user.user_metadata?.role as AuthUser['role']) || 'employee',
    avatar: user.user_metadata?.avatar_url || undefined,
    businessName: user.user_metadata?.business_name || undefined,
  });

  const ensureOrganizationForUser = async (authUser: AuthUser): Promise<string | null> => {
    try {
      // 1) ¿Ya tiene organización?
      const { data: links, error: linkErr } = await supabase
        .from('organization_users')
        .select('organization_id')
        .eq('user_id', authUser.id);

      if (linkErr) console.warn('organization_users query error:', linkErr);

      if (links && links.length > 0) {
        return links[0].organization_id;
      }

      // 2) Crear nueva organización con el businessName (fallback al email)
      const orgName =
        authUser.businessName?.trim() ||
        (authUser.name ? `${authUser.name}'s Business` : authUser.email) ||
        'My Business';

      const { data: orgRows, error: orgErr } = await supabase
        .from('organizations')
        .insert({ name: orgName })
        .select('id')
        .single();

      if (orgErr || !orgRows) {
        console.error('organizations insert error:', orgErr);
        return null;
      }

      const newOrgId = orgRows.id as string;

      // 3) Linkear usuario como owner
      const { error: linkInsertErr } = await supabase
        .from('organization_users')
        .insert({ organization_id: newOrgId, user_id: authUser.id, role: 'owner' });

      if (linkInsertErr) {
        console.error('organization_users insert error:', linkInsertErr);
        // no retornamos null, ya que la org sí existe; podríamos limpiar luego
      }

      return newOrgId;
    } catch (e) {
      console.error('ensureOrganizationForUser exception:', e);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return false;
    }

    const authUser = mapAuthUser(data.user);
    setCurrentUser(authUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(authUser));

    const orgId = await ensureOrganizationForUser(authUser);
    setCurrentOrganizationId(orgId);
    localStorage.setItem('currentOrganizationId', orgId ?? '');

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    clearAuthState();
  };

  const clearAuthState = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentOrganizationId(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentOrganizationId');
  };

  // ---- Mock users API sin tocar ----
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
      prev.map(user => (user.id === id ? { ...user, ...updates } : user))
    );
    if (currentUser && currentUser.id === id) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    if (currentUser && currentUser.id === id) {
      logout();
    }
  };

  const getUser = (id: string): User | undefined => users.find(u => u.id === id);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        currentOrganizationId,
        users,
        login,
        logout,
        isAuthenticated,
        addUser,
        updateUser,
        deleteUser,
        getUser,
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
