import React from 'react';
import { FileImport } from '../components/import/FileImport';

export const ImportPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Import Data</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Import your inventory data from CSV or Excel files
        </p>
      </div>

      <FileImport />
    </div>
  );
};