import { Link } from 'react-router-dom';
import { useContext, useRef } from 'react';
import { ProductContext } from '../context/ProductContext';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

const Home = () => {
  const { products, loading } = useContext(ProductContext);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Generate dynamic categories from DB
  let collections = [];
  if (products && products.length > 0) {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    collections = uniqueCategories.map(category => {
      const firstProduct = products.find(p => p.category === category);
      return {
        name: category,
        image: firstProduct?.images?.[0] || '/images/hero_banner.png'
      };
    });
  } else {
    collections = [
      { name: 'Designer Dresses', image: '/images/dresses_collection.png', query: 'Dresses' },
      { name: 'Tailored Suits', image: '/images/suits_collection.png', query: 'Suits' }
    ];
  }
  return (
    <div className="animate-fade-in pt-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/light_dress_stage.png" 
            alt="Light dress on fashion stage" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="container relative z-10 text-center text-white px-4">
          <span className="block text-accent font-serif tracking-[0.2em] uppercase text-sm mb-4">New Collection 2026</span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">VEsarikaa<br/>Collections</h1>
          <p className="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto opacity-90">Discover the latest trends in high-end fashion with our exclusive curated collections.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="bg-accent text-white px-8 py-3 rounded-sm font-medium hover:bg-accent-hover transition-colors">Shop Now</Link>
            <Link to="/portfolio" className="bg-transparent border border-white text-white px-8 py-3 rounded-sm font-medium hover:bg-white hover:text-primary transition-colors">Explore Portfolio</Link>
          </div>
        </div>
      </section>

      {/* Featured Collections / Categories Section */}
      <section className="py-20 bg-bg-secondary">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl mb-4 text-primary">Discover Our Collections</h2>
              <p className="text-text-secondary max-w-2xl">Explore our carefully curated categories designed for the modern era.</p>
            </div>
            <div className="hidden md:flex gap-4">
              <button onClick={() => scroll('left')} className="p-3 border border-border-light rounded-full text-primary hover:bg-white hover:text-accent transition-colors"><CaretLeft size={24} /></button>
              <button onClick={() => scroll('right')} className="p-3 border border-border-light rounded-full text-primary hover:bg-white hover:text-accent transition-colors"><CaretRight size={24} /></button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-96">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : (
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 md:gap-8 pb-8 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Inject CSS to hide scrollbar for webkit browsers without needing an external CSS file */}
              <style>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              {collections.map((collection, idx) => (
                <Link key={idx} to={`/portfolio?category=${collection.query || collection.name}`} className="min-w-[75vw] md:min-w-[200px] lg:min-w-[250px] snap-center group relative h-[250px] overflow-hidden rounded-sm shadow-sm flex-shrink-0 cursor-pointer block">
                  <img src={collection.image} alt={collection.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white text-xl mb-2 font-serif">{collection.name}</h3>
                    <span className="text-accent group-hover:text-white transition-colors underline underline-offset-4 inline-flex items-center gap-2 text-sm">
                      Shop Collection <CaretRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl mb-6 text-primary">About VESatikaa Collections</h2>
          <p className="text-text-secondary leading-relaxed mb-8">
            We believe that fashion is an expression of individuality and art. Founded with the vision to bring premium, exclusive designer wear directly to your wardrobe, VESatikaa Collections meticulously sources the finest materials and works with top-tier artisans globally. Our commitment is to quality, sustainability, and unparalleled elegance.
          </p>
          <Link to="/contact" className="inline-block border-b-2 border-primary text-primary font-medium hover:text-accent hover:border-accent transition-colors pb-1">Get in Touch</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
