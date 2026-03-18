import { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import AddItem from './AddItem.jsx'; 
import ItemCard from './ItemCard';
import ItemDetail from './ItemDetail';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Electronics', 'Books', 'Clothing', 'Dorm Gear'];
  
  // Login States
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [loginInput, setLoginInput] = useState(''); // Tracks what you type in the login box

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (loginInput.trim() !== '') {
      setUsername(loginInput);
      localStorage.setItem('username', loginInput);
      setLoginInput(''); // Clear input after login
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:5000/api/items/${id}`);
        fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Marketplace</h1>
        
        {!username ? (
          <div className="login-box" style={{ display: 'flex', gap: '10px' }}>
            <input 
              placeholder="Enter your name..." 
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button 
              onClick={handleLogin}
              style={{ 
                padding: '8px 15px', 
                backgroundColor: '#2563eb', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer' 
              }}
            >
              Login
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <p style={{ margin: 0 }}>Welcome back, <strong>{username}</strong>!</p>
            <button 
              onClick={() => { 
                setUsername(''); 
                localStorage.removeItem('username'); 
              }}
              style={{ 
                padding: '5px 10px', 
                backgroundColor: '#ef4444', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer' 
              }}
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <Routes>
        <Route path="/" element={
          <>
            <AddItem onRefresh={fetchItems} />
            <hr style={{ margin: '40px 0', border: '0', borderTop: '1px solid #eee' }} />

            <div className="category-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '30px' }}>
              <input
                type="text"
                placeholder="🔍 Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      onDelete={deleteItem} 
                      currentUsername={username} 
                    />
                  ))
                ) : (
                  <p>No items match your search.</p>
                )}
              </div>
            )}
          </>
        } />

        <Route path="/item/:id" element={<ItemDetail />} />
      </Routes>
    </div>
  );
}

export default App;