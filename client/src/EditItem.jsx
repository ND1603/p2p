import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api';
import { useAuth } from './AuthContext';

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { username } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: null
  });
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch item details
    api.get(`/items/${id}`)
      .then(res => {
        const item = res.data;
        if (item.seller !== username) {
          alert("You are not authorized to edit this item.");
          navigate('/');
        }
        setFormData({
          title: item.title,
          description: item.description,
          price: item.price,
          category: item.category,
          image: null
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching item:", err);
        setStatusMsg({ text: "Error fetching item details.", type: 'error' });
        setLoading(false);
      });
  }, [id, username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: '', type: '' });

    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append('category', formData.category);
    formDataObj.append('price', Number(formData.price));
    if (formData.image) {
      formDataObj.append('image', formData.image);
    }

    try {
      await api.put(`/items/${id}`, formDataObj);
      setStatusMsg({ text: "Item updated successfully!", type: 'success' });
      setTimeout(() => navigate(`/item/${id}`), 1000);
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      setStatusMsg({ text: "Error updating item. Try again.", type: 'error' });
    }
  };

  if (loading) return <div className="loading">Loading details...</div>;

  return (
    <div className="add-item-box" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', background: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Edit Item</h3>
      {statusMsg.text && (
        <div className={`status-msg ${statusMsg.type}`}>
          {statusMsg.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="form-container">
        <label style={{ fontWeight: 500, color: '#4b5563' }}>Title</label>
        <input
          placeholder="Product Title"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <label style={{ fontWeight: 500, color: '#4b5563' }}>Description</label>
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />

        <div className="flex-row">
          <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
             <label style={{ fontWeight: 500, color: '#4b5563' }}>Price ($)</label>
             <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              style={{ width: '100%', boxSizing: 'border-box' }}
             />
          </div>

          <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
             <label style={{ fontWeight: 500, color: '#4b5563' }}>Category</label>
             <input
              placeholder="Category"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              style={{ width: '100%', boxSizing: 'border-box' }}
             />
          </div>
        </div>

        <label style={{ fontWeight: 500, color: '#4b5563', marginTop: '10px' }}>Update Image (Optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
          style={{ marginBottom: '15px' }}
        />

        <button type="submit" className="buy-button">Update Item</button>
        <button type="button" onClick={() => navigate(-1)} style={{ marginTop: '10px', background: 'transparent', color: '#6b7280', border: 'none', cursor: 'pointer', textDecoration: 'underline', width: '100%', padding: '10px' }}>Cancel</button>
      </form>
    </div>
  );
}

export default EditItem;
