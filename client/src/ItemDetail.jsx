import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from './api';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    api.get(`/items/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!item) return <div className="loading">Loading details...</div>;

  return (
    <div className="detail-wrapper">
      <Link to="/" className="back-button">← Back to Marketplace</Link>
      
      <div className="product-layout">
        <div className="product-image-section">
          {item.imageUrl ? (
            <img 
              src={`http://localhost:5000/uploads/${item.imageUrl}`} 
              alt={item.title} 
              style={{ width: '100%', maxWidth: '400px', borderRadius: '10px', objectFit: 'cover' }} 
            />
          ) : (
            <div className="image-placeholder">No Image Provided</div>
          )}
        </div>
        <div className="product-info-section">
          <span className="detail-category">{item.category}</span>
          <h1 className="detail-title">{item.title}</h1>
          <p className="detail-price">${item.price}</p>
          
          <div className="seller-box">
            <p>Listed by: <strong>{item.seller || 'Anonymous'}</strong></p>
          </div>

          <div className="detail-description">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          <button className="buy-button" onClick={() => alert("Contacting seller...")}>
            Contact Seller
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;