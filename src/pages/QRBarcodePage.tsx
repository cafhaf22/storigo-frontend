import React from 'react';
import { QRBarcodeGenerator } from '../components/qr/QRBarcodeGenerator';

export const QRBarcodePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Generate QR & Barcodes</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Create scannable QR codes and barcodes for your products. Download and print them for tagging or tracking inventory easily.
        </p>
      </div>

      <QRBarcodeGenerator />
    </div>
  );
};