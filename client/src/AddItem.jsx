import { useState } from 'react';
import axios from 'axios';

function AddItem({ onRefresh }) {
  // Initialize state with empty strings so they are never 'undefined'
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    price: '', 
    category: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // The Safety Net: Ensure no field is undefined before sending to Prisma
    const itemData = {
      title: formData.title || "Untitled",
      description: formData.description || "", 
      category: formData.category || "General",
      price: Number(formData.price) || 0 ,
      seller: localStorage.getItem('username') || 'Anonymous'
    };

    console.log("Sending to server:", itemData);

    try {
      await axios.post('http://localhost:5000/api/items', itemData);
      
      // Clear the form after success
      setFormData({ title: '', description: '', price: '', category: '' });
      
      // Refresh the list in App.jsx
      onRefresh();
      alert("Item posted successfully!");
    } catch (error) {
      console.error("SERVER REJECTED:", error.response?.data || error.message);
      alert("Error: Check the console for details.");
    }
  };

  return (
    <div className="add-item-box">
      <h3>List a New Item</h3>
      <form onSubmit={handleSubmit} className="form-container">
        <input 
          placeholder="Product Title" 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})} 
          required
        />

        <textarea 
          placeholder="Description (e.g., Condition, how long you've had it)" 
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="number"
            placeholder="Price ($)" 
            value={formData.price} 
            onChange={e => setFormData({...formData, price: e.target.value})} 
            style={{ flex: 1 }}
          />

          <input 
            placeholder="Category (e.g. Books)" 
            value={formData.category} 
            onChange={e => setFormData({...formData, category: e.target.value})} 
            style={{ flex: 1 }}
          />
        </div>

        <button type="submit" className="btn-post">Post to Marketplace</button>
      </form>
    </div>
  );
}

export default AddItem;