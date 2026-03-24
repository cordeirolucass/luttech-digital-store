import { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import CartModal from './components/CartModal';
import SuccessScreen from './components/SuccessScreen';
import ToastContainer from './components/ToastContainer';
import Home from './pages/Home';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orderData, setOrderData] = useState(null);

  return (
    <ToastProvider>
      <CartProvider>
        <div className="app">
          <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <Home searchTerm={searchTerm} />
          <CartModal onCheckoutSuccess={(data) => setOrderData(data)} />
          {orderData && (
            <SuccessScreen
              orderData={orderData}
              onClose={() => setOrderData(null)}
            />
          )}
          <ToastContainer />
        </div>
      </CartProvider>
    </ToastProvider>
  );
}
