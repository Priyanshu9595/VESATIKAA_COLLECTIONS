import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const Portfolio = () => {
  const { products } = useContext(ProductContext);
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Extract category from URL query string if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    if (category) {
      setActiveCategory(category);
    } else {
      setActiveCategory('All');
    }
  }, [location]);

  // Get unique categories from products, ensuring 'Others' is always available at the end
  const uniqueCategories = new Set(products.map(p => p.category));
  uniqueCategories.delete('Others'); // Remove to prevent duplicates
  const categories = ['All', ...uniqueCategories, 'Others'];

  // Filter products based on active category
  let displayProducts = activeCategory === 'All' 
    ? [...products] 
    : products.filter(p => p.category === activeCategory);

  // Filter by search query
  if (searchQuery.trim() !== '') {
    const lowerQuery = searchQuery.toLowerCase();
    displayProducts = displayProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description?.toLowerCase().includes(lowerQuery) ||
      p.brand?.toLowerCase().includes(lowerQuery)
    );
  }

  // Sort products
  if (sortBy === 'price-asc') {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    displayProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-bg-primary animate-fade-in">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4 tracking-wide">Our Collections</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Curated selections for the modern connoisseur. Discover pieces that define elegance and timeless style.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4">
            <div className="sticky top-28 bg-bg-secondary p-6 rounded-md shadow-sm border border-border-light">
              <h3 className="text-xl font-serif text-primary mb-6 pb-2 border-b border-border-light">Categories</h3>
              <ul className="flex flex-row lg:flex-col gap-2 lg:gap-3 flex-wrap">
                {categories.map(category => (
                  <li key={category}>
                    <button 
                      className={`w-full text-left px-4 py-2 rounded-sm transition-all text-sm font-medium ${
                        activeCategory === category 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'text-text-secondary hover:bg-white hover:text-primary'
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:w-3/4">
            
            {/* Search & Sort Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-bg-secondary p-4 rounded-md shadow-sm border border-border-light">
              <div className="w-full md:w-1/2">
                <input 
                  type="text"
                  placeholder="Search collections, styles, or brands..."
                  className="w-full p-2.5 border border-border-light rounded-sm focus:outline-none focus:border-accent text-sm bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-auto">
                <select 
                  className="w-full md:w-auto p-2.5 border border-border-light rounded-sm focus:outline-none focus:border-accent text-sm bg-white cursor-pointer"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {displayProducts.map(product => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-bg-secondary rounded-md shadow-sm border border-border-light p-12 text-center">
                <p className="text-text-secondary text-lg">No products found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-6 bg-primary text-white px-6 py-2 rounded-sm text-sm hover:bg-accent transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
          
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
