import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { QRBarcodePage } from './pages/QRBarcodePage';
import { ImportPage } from './pages/ImportPage';
import { UsersPage } from './pages/UsersPage';
import { LoginPage } from './pages/LoginPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <InventoryProvider>
          <Router>
            <Routes>
              {/* Pública */}
              <Route path="/login" element={<LoginPage />} />

              {/* Privadas (Layout solo aquí) */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <InventoryPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/qr-barcodes"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <QRBarcodePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/import"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ImportPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <UsersPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </InventoryProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
