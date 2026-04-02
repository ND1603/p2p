import { useState, useEffect } from 'react';
import api from './api';
import ItemCard from './ItemCard';
import { useAuth } from './AuthContext';

function Profile() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = useAuth();

  useEffect(() => {
    if (username) fetchItems();
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
      <p style={{ color: '#666', marginBottom: '30px' }}>Manage your listings below.</p>
      
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
  );
}

export default Profile;
