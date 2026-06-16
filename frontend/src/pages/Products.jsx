import { useContext, useState } from 'react';
import { ProductContext } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const { products, loading, error } = useContext(ProductContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');

  let displayProducts = [...products];

  if (searchQuery.trim() !== '') {
    const lowerQuery = searchQuery.toLowerCase();
    displayProducts = displayProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description?.toLowerCase().includes(lowerQuery) ||
      p.brand?.toLowerCase().includes(lowerQuery)
    );
  }

  if (sortBy === 'price-asc') {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    displayProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-bg-secondary animate-fade-in">
      <div className="container mx-auto px-4">
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-serif text-primary mb-4">All Products</h1>
          <p className="text-text-secondary">Browse our complete collection of exclusive fashion.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
            {error}
          </div>
        ) : (
          <>
            {/* Search & Sort Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-md shadow-sm border border-border-light">
              <div className="w-full md:w-1/2">
                <input 
                  type="text"
                  placeholder="Search products..."
                  className="w-full p-2.5 border border-border-light rounded-sm focus:outline-none focus:border-accent text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-auto">
                <select 
                  className="w-full md:w-auto p-2.5 border border-border-light rounded-sm focus:outline-none focus:border-accent text-sm cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Sort by: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayProducts.map(product => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-md shadow-sm border border-border-light">
                <p className="text-text-secondary text-lg">No products found matching your criteria.</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-6 bg-primary text-white px-6 py-2 rounded-sm text-sm hover:bg-accent transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
