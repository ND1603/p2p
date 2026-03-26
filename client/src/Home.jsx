import { useState, useEffect } from 'react';
import api from './api';
import AddItem from './AddItem.jsx'; 
import ItemCard from './ItemCard';
import { useAuth } from './AuthContext';

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Electronics', 'Books', 'Clothing', 'Dorm Gear'];
  const [viewMode, setViewMode] = useState('all');
  const { username } = useAuth();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/items');
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesUser = viewMode === 'all' || item.seller === username;
    return matchesSearch && matchesCategory && matchesUser;
  });

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

  return (
    <>
      {username && <AddItem onRefresh={fetchItems} />}
      
      <div className="view-toggle" style={{ margin: '20px 0' }}>
        <button onClick={() => setViewMode('all')} className={viewMode === 'all' ? 'active-tab' : ''}>All Items</button>
        {username && <button onClick={() => setViewMode('mine')} className={viewMode === 'mine' ? 'active-tab' : ''}>My Listings</button>}
      </div>

      <div className="category-filters">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}>{cat}</button>
        ))}
      </div>

      <input
        type="text"
        placeholder="🔍 Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {loading ? <p>Loading...</p> : (
        <div className="grid">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} onDelete={deleteItem} currentUsername={username} />
          ))}
        </div>
      )}
    </>
  );
}

export default Home;
