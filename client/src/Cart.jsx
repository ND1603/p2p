import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { username } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (!username) {
      alert("Please log in to checkout.");
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerUsername: username, items: cart })
      });

      if (response.ok) {
        alert("Thank you for your purchase! Your order has been placed.");
        clearCart();
        navigate('/profile');
      } else {
        const errorData = await response.json();
        alert(`Checkout failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout.");
    }
  };

  return (
    <div className="cart-container" style={{ padding: '20px 0' }}>
      <h2 style={{ marginBottom: '20px' }}>Your Shopping Cart</h2>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>Your cart is currently empty.</p>
          <Link to="/">
            <button style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Continue Shopping</button>
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Item</th>
                <th style={{ padding: '10px' }}>Price</th>
                <th style={{ padding: '10px' }}>Quantity</th>
                <th style={{ padding: '10px' }}>Total</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {item.imageUrl && (
                      <img src={`http://localhost:5000/uploads/${item.imageUrl}`} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    )}
                    <span>{item.title}</span>
                  </td>
                  <td style={{ padding: '10px' }}>${item.price.toFixed(2)}</td>
                  <td style={{ padding: '10px' }}>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)} 
                      style={{ width: '60px', padding: '5px' }}
                    />
                  </td>
                  <td style={{ padding: '10px' }}>${(item.price * item.quantity).toFixed(2)}</td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => removeFromCart(item.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary" style={{ textAlign: 'right', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '15px' }}>Subtotal: ${getCartTotal().toFixed(2)}</h3>
            <button onClick={handleCheckout} style={{ padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>Checkout Now</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
