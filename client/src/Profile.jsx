import { useState, useEffect } from 'react';
import api from './api';
import ItemCard from './ItemCard';
import { useAuth } from './AuthContext';

function Profile() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const { username } = useAuth();

  useEffect(() => {
    if (username) {
      fetchItems();
      fetchOrders();
    }
  }, [username]);

  const fetchItems = async () => {
    try {
      const response = await api.get('/items');
      const userItems = response.data.filter(item => item.seller === username);
      setItems(userItems);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders/${username}`);
      setOrders(response.data);
      setOrdersLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrdersLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/items/${id}`);
        fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  if (!username) return <p>Please log in to view your profile.</p>;

  return (
    <div className="profile-container" style={{ padding: '20px 0' }}>
      <h2 style={{ marginBottom: '10px' }}>{username}'s Dashboard</h2>
      
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Your Listings</h3>
        {loading ? (
          <p>Loading your items...</p>
        ) : (
          <div className="grid">
            {items.length === 0 ? (
              <p>You haven't listed any items yet.</p>
            ) : (
              items.map(item => (
                <ItemCard key={item.id} item={item} onDelete={deleteItem} currentUsername={username} />
              ))
            )}
          </div>
        )}
      </div>

      <div>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Order History</h3>
        {ordersLoading ? (
          <p>Loading your orders...</p>
        ) : orders.length === 0 ? (
          <p>You haven't placed any orders yet.</p>
        ) : (
          <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map(order => (
              <div key={order.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>Order #{order.id}</span>
                  <span style={{ color: '#666' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>Total: ${order.total.toFixed(2)}</span>
                </div>
                <div>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                    {order.items.map(item => (
                      <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                        <span>{item.quantity}x {item.itemTitle}</span>
                        <span>${item.priceAtPurchase.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
