import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';
import PwaInstallPrompt from './components/PwaInstallPrompt';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <SocketProvider>
            <AppRoutes />
            <PwaInstallPrompt />
          </SocketProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;