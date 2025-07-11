import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { UserProvider } from './contexts/UserContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { QRBarcodePage } from './pages/QRBarcodePage';
import { ImportPage } from './pages/ImportPage';
import { UsersPage } from './pages/UsersPage';
import { LoginPage } from './pages/LoginPage';
import { useUser } from './contexts/UserContext';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// App component
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <InventoryProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/inventory" 
                  element={
                    <ProtectedRoute>
                      <InventoryPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/qr-barcodes" 
                  element={
                    <ProtectedRoute>
                      <QRBarcodePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/import" 
                  element={
                    <ProtectedRoute>
                      <ImportPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/users" 
                  element={
                    <ProtectedRoute>
                      <UsersPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Router>
        </InventoryProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;