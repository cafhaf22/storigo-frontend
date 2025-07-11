/// TODO: All the related things to handle and parsing xlsx files will be delegated to the backend in the future
//       This component is just a placeholder for the UI and basic file handling logic.
//       The actual parsing and validation will be done on the server side to ensure better performance and
//       security, especially for large files or complex data structures.
//       For now, this component will handle file selection, display import status, and show errors
//       while the backend will take care of parsing the file, validating the data, and saving it to the database.

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertTriangle, Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { useInventory } from '../../contexts/InventoryContext';
import { validateProduct } from '../../utils/validators';

interface ImportStatus {
  totalRows: number;
  processed: number;
  successful: number;
  failed: number;
  errors: { row: number; field: string; message: string }[];
}

export const FileImport: React.FC = () => {
  const { addProduct } = useInventory();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setImportStatus(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  const processCSV = (text: string) => {
    return new Promise<any[]>((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
      });
    });
  };

  const processExcel = (arrayBuffer: ArrayBuffer) => {
    const workbook = XLSX.read(arrayBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(worksheet);
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setImportStatus({
      totalRows: 0,
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [],
    });

    try {
      let data: any[] = [];

      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        data = await processCSV(text);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const arrayBuffer = await file.arrayBuffer();
        data = processExcel(arrayBuffer);
      }

      const status: ImportStatus = {
        totalRows: data.length,
        processed: 0,
        successful: 0,
        failed: 0,
        errors: [],
      };

      // Process each row
      for (const [index, row] of data.entries()) {
        // Map fields
        const productData = {
          name: row.name || row.product_name || row.product || row.Name || row.title || row.Title || '',
          quantity: parseInt(row.quantity || row.stock || row.Quantity || row.Stock || 0, 10),
          price: parseFloat(row.price || row.Price || 0),
          category: row.category || row.Category || row.type || row.Type || 'Uncategorized',
          image: row.image || row.Image || row.imageUrl || row.ImageUrl || row.url || row.Url || undefined,
        };

        // Validate fields
        let hasErrors = false;
        for (const [field, value] of Object.entries(productData)) {
          const error = validateProduct(field, value);
          if (error) {
            status.errors.push({
              row: index + 1,
              field: error.field,
              message: error.message,
            });
            hasErrors = true;
          }
        }

        if (hasErrors) {
          status.failed++;
        } else {
          addProduct(productData);
          status.successful++;
        }

        status.processed++;
        setImportStatus({ ...status });
      }
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setImportStatus(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 ${
              isDragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                : 'border-gray-300 dark:border-gray-700'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center">
              <Upload
                size={36}
                className="text-gray-400 dark:text-gray-500 mb-4"
              />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isDragActive
                  ? 'Drop the files here...'
                  : 'Drag & drop files here, or click to select files'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Supported formats: CSV, XLSX, XLS
              </p>
              <Button size="sm">Select File</Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
              <div className="flex items-center">
                <div className="p-2 mr-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <FileText
                    size={24}
                    className="text-primary-500 dark:text-primary-400"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFile}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </Button>
            </div>

            {importStatus ? (
              <div className="mb-6">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Import Summary
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Rows
                      </p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {importStatus.totalRows}
                      </p>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Processed
                      </p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {importStatus.processed}
                      </p>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-success-600 dark:text-success-400">
                        Successful
                      </p>
                      <p className="text-2xl font-semibold text-success-600 dark:text-success-400">
                        {importStatus.successful}
                      </p>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-danger-600 dark:text-danger-400">
                        Failed
                      </p>
                      <p className="text-2xl font-semibold text-danger-600 dark:text-danger-400">
                        {importStatus.failed}
                      </p>
                    </div>
                  </div>
                </div>

                {importStatus.errors.length > 0 && (
                  <div className="p-4 rounded-lg bg-danger-50 dark:bg-danger-900/10 border border-danger-200 dark:border-danger-800">
                    <div className="flex items-center mb-2">
                      <AlertTriangle
                        size={20}
                        className="text-danger-500 mr-2"
                      />
                      <h3 className="text-lg font-medium text-danger-700 dark:text-danger-400">
                        Import Errors
                      </h3>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500 dark:text-gray-400">
                            <th className="pb-2">Row</th>
                            <th className="pb-2">Field</th>
                            <th className="pb-2">Error</th>
                          </tr>
                        </thead>
                        <tbody>
                          {importStatus.errors.map((error, idx) => (
                            <tr key={idx} className="border-t border-danger-200 dark:border-danger-800">
                              <td className="py-2">{error.row}</td>
                              <td className="py-2 capitalize">{error.field}</td>
                              <td className="py-2">{error.message}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  <Button variant="secondary" onClick={clearFile}>
                    Import Another File
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={() => window.location.href = '/inventory'}
                  >
                    View Inventory
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end space-x-3 mt-4">
                <Button variant="secondary" onClick={clearFile}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={processFile}
                  isLoading={isProcessing}
                  leftIcon={isProcessing ? undefined : <Upload size={16} />}
                >
                  {isProcessing ? 'Processing...' : 'Import Now'}
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Import Guidelines
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              For successful data import, ensure your file includes these columns:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-2">
              <li>
                <span className="font-medium">Name</span> - Product name (required)
              </li>
              <li>
                <span className="font-medium">Quantity</span> - Stock amount (required, numeric)
              </li>
              <li>
                <span className="font-medium">Price</span> - Product price (required, numeric)
              </li>
              <li>
                <span className="font-medium">Category</span> - Product category
              </li>
              <li>
                <span className="font-medium">Image</span> - Image URL (optional)
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};