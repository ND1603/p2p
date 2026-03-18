import { Link } from 'react-router-dom';

// MAKE SURE currentUsername is inside these brackets!
function ItemCard({ item, onDelete, currentUsername }) {
  
  // This checks if the logged-in user is the same as the seller
  const isOwner = currentUsername === item.seller;

  return (
    <div className="item-card">
      <div className="card-header">
        <span className="category-tag">{item.category}</span>
        
        {/* The Delete button only shows if isOwner is true */}
        {isOwner && (
          <button onClick={() => onDelete(item.id)} className="delete-btn">×</button>
        )}
      </div>
      
      <h4>{item.title}</h4>
      <p className="price">${item.price}</p>
      <p className="seller-name">Seller: {item.seller}</p>
      
      <Link to={`/item/${item.id}`}>
        <button className="details-btn">View Details</button>
      </Link>
    </div>
  );
}

export default ItemCard;