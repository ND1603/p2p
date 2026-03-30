import { useState } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

function AddItem({ onRefresh }) {
  const { username } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: null
  });
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: '', type: '' });

    const formDataObj = new FormData();
    formDataObj.append('title', formData.title || "Untitled");
    formDataObj.append('description', formData.description || "");
    formDataObj.append('category', formData.category || "General");
    formDataObj.append('price', Number(formData.price) || 0);
    formDataObj.append('seller', username || 'Anonymous');
    if (formData.image) {
      formDataObj.append('image', formData.image);
    }

    try {
      await api.post('/items', formDataObj);
      setFormData({ title: '', description: '', price: '', category: '', image: null });
      e.target.reset();
      onRefresh();
      setStatusMsg({ text: "Item posted successfully!", type: 'success' });
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error("SERVER REJECTED:", error.response?.data || error.message);
      setStatusMsg({ text: "Error posting item. Try again.", type: 'error' });
    }
  };

  return (
    <div className="add-item-box">
      <h3>List a New Item</h3>
      {statusMsg.text && (
        <div className={`status-msg ${statusMsg.type}`}>
          {statusMsg.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="form-container">
        <input
          placeholder="Product Title"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Description (e.g., Condition, how long you've had it)"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />

        <div className="flex-row">
          <input
            type="number"
            placeholder="Price ($)"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            className="flex-1"
          />

          <input
            placeholder="Category (e.g. Books)"
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="flex-1"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
          style={{ marginBottom: '15px' }}
        />

        <button type="submit" className="btn-post">Post to Marketplace</button>
      </form>
    </div>
  );
}

export default AddItem;