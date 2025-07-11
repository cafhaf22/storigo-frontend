import React from 'react';
import { UserTable } from '../components/users/UserTable';

export const UsersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage user accounts and permissions
        </p>
      </div>

      <UserTable />
    </div>
  );
};