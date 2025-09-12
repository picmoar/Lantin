import React from 'react';

interface CartItem {
  id: string;
  title: string;
  artist: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShoppingCartModalProps {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

const ShoppingCartModal: React.FC<ShoppingCartModalProps> = ({ 
  cart, 
  onClose, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        width: '100%',
        maxWidth: '400px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h3 style={{fontSize: '20px', fontWeight: 'bold', color: '#111827'}}>Shopping Cart</h3>
          <button onClick={onClose} style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer'}}>×</button>
        </div>

        {cart.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px 20px', color: '#6b7280'}}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>🛍️</div>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px'}}>
              {cart.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}>
                  <img 
                    src={item.image}
                    alt={item.title}
                    style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px'}}
                  />
                  <div style={{flex: 1}}>
                    <h4 style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '4px'}}>{item.title}</h4>
                    <p style={{color: '#6b7280', fontSize: '12px', marginBottom: '4px'}}>{item.artist}</p>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span style={{fontWeight: 'bold'}}>${item.price}</span>
                      <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          style={{width: '24px', height: '24px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer'}}
                        >-</button>
                        <span style={{minWidth: '20px', textAlign: 'center'}}>{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          style={{width: '24px', height: '24px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer'}}
                        >+</button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px'}}
                  >×</button>
                </div>
              ))}
            </div>

            <div style={{borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginBottom: '16px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <span style={{fontSize: '18px', fontWeight: 'bold'}}>Total: ${total}</span>
              </div>

              <div style={{display: 'flex', gap: '12px'}}>
                <button
                  onClick={onCheckout}
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Checkout
                </button>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartModal;
