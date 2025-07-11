import React, { useState } from 'react';
import { Download, Printer, QrCode, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useInventory } from '../../contexts/InventoryContext';

export const QRBarcodeGenerator: React.FC = () => {
  const { products } = useInventory();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [codeType, setCodeType] = useState<'qr' | 'barcode'>('qr');

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const generateQRCode = (text: string) => {
    // Create a more realistic QR code pattern
    const createQRPattern = () => {
      const size = 21; // Standard QR code is 21x21 modules for version 1
      const pattern = [];
      
      for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
          // Create finder patterns (corners)
          if ((i < 7 && j < 7) || (i < 7 && j >= size - 7) || (i >= size - 7 && j < 7)) {
            // Finder pattern logic
            if ((i === 0 || i === 6 || j === 0 || j === 6) ||
                (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
              row.push(true);
            } else {
              row.push(false);
            }
          }
          // Timing patterns
          else if (i === 6 || j === 6) {
            row.push((i + j) % 2 === 0);
          }
          // Data area - pseudo-random pattern based on text
          else {
            const hash = (i * size + j + text.length) % 3;
            row.push(hash === 0);
          }
        }
        pattern.push(row);
      }
      return pattern;
    };

    const pattern = createQRPattern();

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="w-48 h-48 bg-white border border-gray-300 rounded-lg p-4 flex items-center justify-center">
          <div className="grid grid-cols-21 gap-0 w-40 h-40">
            {pattern.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`w-full h-full ${cell ? 'bg-black' : 'bg-white'}`}
                  style={{ aspectRatio: '1' }}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Product Label */}
        <div className="bg-white border border-gray-300 rounded-lg p-4 w-48 text-center">
          <div className="text-sm font-semibold text-gray-900 mb-1">
            {selectedProduct?.name}
          </div>
          <div className="text-xs text-gray-600 mb-2">
            ID: {selectedProduct?.id.substring(0, 8)}
          </div>
          <div className="text-xs text-gray-500">
            ${selectedProduct?.price} • {selectedProduct?.category}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Stock: {selectedProduct?.quantity} units
          </div>
        </div>
      </div>
    );
  };

  const generateBarcode = (text: string) => {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="w-64 h-32 bg-white border border-gray-300 rounded-lg flex flex-col items-center justify-center p-4">
          <div className="flex items-end space-x-px mb-2">
            {Array.from({ length: 40 }, (_, i) => (
              <div
                key={i}
                className="bg-black"
                style={{
                  width: '2px',
                  height: `${Math.random() * 40 + 20}px`,
                }}
              />
            ))}
          </div>
          <div className="text-xs font-mono text-center">
            {text.replace(/\s+/g, '').substring(0, 12).toUpperCase()}
          </div>
        </div>

        {/* Product Label */}
        <div className="bg-white border border-gray-300 rounded-lg p-4 w-64 text-center">
          <div className="text-sm font-semibold text-gray-900 mb-1">
            {selectedProduct?.name}
          </div>
          <div className="text-xs text-gray-600 mb-2">
            ID: {selectedProduct?.id.substring(0, 8)}
          </div>
          <div className="text-xs text-gray-500">
            ${selectedProduct?.price} • {selectedProduct?.category}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Stock: {selectedProduct?.quantity} units
          </div>
        </div>
      </div>
    );
  };

  const handleDownload = () => {
    if (!selectedProduct) return;
    
    // In a real implementation, this would generate and download the actual QR/barcode
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      canvas.width = 300;
      canvas.height = 400;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 300, 400);
      
      // Draw QR code placeholder
      ctx.fillStyle = 'black';
      ctx.fillRect(50, 50, 200, 200);
      ctx.fillStyle = 'white';
      ctx.fillRect(60, 60, 180, 180);
      
      // Add product info
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(selectedProduct.name, 150, 280);
      ctx.font = '12px Arial';
      ctx.fillText(`ID: ${selectedProduct.id.substring(0, 8)}`, 150, 300);
      ctx.fillText(`$${selectedProduct.price} • ${selectedProduct.category}`, 150, 320);
      ctx.fillText(`Stock: ${selectedProduct.quantity} units`, 150, 340);
      
      const link = document.createElement('a');
      link.download = `${selectedProduct.name}-${codeType}-label.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handlePrint = () => {
    if (!selectedProduct) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print ${codeType.toUpperCase()} Label - ${selectedProduct.name}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px; 
                background: white;
              }
              .label-container { 
                border: 2px solid #000; 
                width: 300px; 
                margin: 20px auto; 
                padding: 20px;
                background: white;
              }
              .code-placeholder { 
                border: 2px solid #000; 
                width: 200px; 
                height: 200px; 
                margin: 0 auto 20px; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                font-weight: bold;
              }
              .product-info { 
                text-align: center; 
              }
              .product-name { 
                font-size: 16px; 
                font-weight: bold; 
                margin-bottom: 5px; 
              }
              .product-details { 
                font-size: 12px; 
                color: #666; 
                margin: 2px 0; 
              }
            </style>
          </head>
          <body>
            <div class="label-container">
              <div class="code-placeholder">
                ${codeType.toUpperCase()} CODE
              </div>
              <div class="product-info">
                <div class="product-name">${selectedProduct.name}</div>
                <div class="product-details">ID: ${selectedProduct.id.substring(0, 8)}</div>
                <div class="product-details">$${selectedProduct.price} • ${selectedProduct.category}</div>
                <div class="product-details">Stock: ${selectedProduct.quantity} units</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Product
              </label>
              <select
                id="product-select"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Choose a product...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Code Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="codeType"
                    value="qr"
                    checked={codeType === 'qr'}
                    onChange={(e) => setCodeType(e.target.value as 'qr' | 'barcode')}
                    className="mr-2"
                  />
                  <QrCode size={16} className="mr-1" />
                  QR Code
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="codeType"
                    value="barcode"
                    checked={codeType === 'barcode'}
                    onChange={(e) => setCodeType(e.target.value as 'qr' | 'barcode')}
                    className="mr-2"
                  />
                  <BarChart3 size={16} className="mr-1" />
                  Barcode
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedProduct && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              {codeType === 'qr' 
                ? generateQRCode(`${selectedProduct.name}-${selectedProduct.id}`)
                : generateBarcode(`${selectedProduct.name}-${selectedProduct.id}`)
              }
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Selected Product Details
                </h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p><span className="font-medium">Name:</span> {selectedProduct.name}</p>
                  <p><span className="font-medium">Price:</span> ${selectedProduct.price}</p>
                  <p><span className="font-medium">Stock:</span> {selectedProduct.quantity} units</p>
                  <p><span className="font-medium">Category:</span> {selectedProduct.category}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  onClick={handleDownload}
                  leftIcon={<Download size={16} />}
                  className="flex-1"
                >
                  Download Label
                </Button>
                <Button
                  variant="secondary"
                  onClick={handlePrint}
                  leftIcon={<Printer size={16} />}
                  className="flex-1"
                >
                  Print
                </Button>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <p className="font-medium mb-1">Tips:</p>
                <ul className="space-y-1">
                  <li>• QR codes work best for mobile scanning</li>
                  <li>• Barcodes are ideal for traditional scanners</li>
                  <li>• Print on white paper for best results</li>
                  <li>• Test scan before mass printing</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!selectedProduct && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mb-4">
              <QrCode size={48} className="mx-auto text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Select a Product
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Choose a product from the dropdown above to generate its QR code or barcode
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};