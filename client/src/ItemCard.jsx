import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

function ItemCard({ item, onDelete, currentUsername }) {
  const isOwner = currentUsername === item.seller;
  const { addToCart } = useCart();

  return (
    <div className="item-card">
      <div className="card-header">
        <span className="category-tag">{item.category}</span>
        
        {isOwner && (
          <div className="owner-actions" style={{ display: 'flex', gap: '8px' }}>
            <Link to={`/edit-item/${item.id}`} style={{ textDecoration: 'none' }}>
              <button className="edit-btn" style={{ background: '#fef08a', color: '#854d0e', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✎</button>
            </Link>
            <button onClick={() => onDelete(item.id)} className="delete-btn">×</button>
          </div>
        )}
      </div>
      
      <h4>{item.title}</h4>
      <p className="price">${item.price}</p>
      <p className="seller-name">Seller: {item.seller}</p>
      
      {item.imageUrl && (
        <img 
          src={`http://localhost:5000/uploads/${item.imageUrl}`} 
          alt={item.title} 
          style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} 
        />
      )}
      
      <Link to={`/item/${item.id}`}>
        <button className="details-btn">View Details</button>
      </Link>
      
      {!isOwner && currentUsername && (
        <button onClick={() => addToCart(item)} style={{ marginTop: '10px', width: '100%', padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add to Cart
        </button>
      )}
    </div>
  );
}

export default ItemCard;