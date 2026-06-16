import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from '@phosphor-icons/react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.countInStock === 0) {
      alert('Product is out of stock');
      return;
    }

    dispatch(addToCart({
      id: product.id || product._id,
      name: product.name,
      image: product.images && product.images[0],
      price: product.price,
      size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : '',
      color: product.colors && product.colors.length > 0 ? product.colors[0] : '',
      qty: 1,
      countInStock: product.countInStock,
      isAdding: true
    }));
    navigate('/cart');
  };

  return (
    <div className="group relative bg-white border border-border-light rounded-sm overflow-hidden hover:shadow-md transition-shadow animate-fade-in">
      <Link to={`/product/${product.id || product._id}`} className="block">
        <div className="relative aspect-[3/4] bg-bg-secondary overflow-hidden">
          <img 
            src={product.images && product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            loading="lazy" 
          />
          {(!userInfo || !userInfo.isAdmin) && (
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <button 
                className="bg-primary text-white w-full py-3 px-4 rounded-sm font-medium flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all hover:bg-accent disabled:bg-black/50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
              >
                <ShoppingCart size={20} /> 
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
        <div className="p-4 bg-white">
          <span className="text-xs text-text-secondary uppercase tracking-wider mb-1 block">{product.category}</span>
          <h3 className="text-primary font-medium text-lg mb-1 truncate">{product.name}</h3>
          <p className="text-text-secondary">${product.price.toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
