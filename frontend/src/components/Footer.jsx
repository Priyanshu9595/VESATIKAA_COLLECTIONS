import { useState } from 'react';
import { Link } from 'react-router-dom';
import { InstagramLogo, TwitterLogo, FacebookLogo } from '@phosphor-icons/react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };
  return (
    <footer className="bg-bg-secondary pt-16 pb-8 border-t border-border-light mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="font-serif text-2xl font-bold tracking-wider text-primary no-underline block mb-4">
              VESatikaa<span className="text-accent font-normal">Collections</span>
            </Link>
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              Elevating your style with premium, curated fashion from the world's finest designers. 
              Experience true luxury.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors" aria-label="Instagram">
                <InstagramLogo size={24} />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors" aria-label="Twitter">
                <TwitterLogo size={24} />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors" aria-label="Facebook">
                <FacebookLogo size={24} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="font-serif text-lg text-primary mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/portfolio" className="text-text-secondary hover:text-accent transition-colors text-sm">All Collections</Link></li>
              <li><Link to="/products" className="text-text-secondary hover:text-accent transition-colors text-sm">New Arrivals</Link></li>
              <li><Link to="/portfolio?category=Dresses" className="text-text-secondary hover:text-accent transition-colors text-sm">Evening Wear</Link></li>
              <li><Link to="/portfolio?category=Suits" className="text-text-secondary hover:text-accent transition-colors text-sm">Designer Suits</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-serif text-lg text-primary mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-text-secondary hover:text-accent transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="/shipping-and-returns" className="text-text-secondary hover:text-accent transition-colors text-sm">Shipping & Returns</Link></li>
              <li><Link to="/size-guide" className="text-text-secondary hover:text-accent transition-colors text-sm">Size Guide</Link></li>
              <li><Link to="/faq" className="text-text-secondary hover:text-accent transition-colors text-sm">FAQ</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-serif text-lg text-primary mb-4">Newsletter</h3>
            <p className="text-text-secondary text-sm mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            {subscribed ? (
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] px-4 py-3 rounded-sm text-sm animate-fade-in">
                Thank you! You have successfully subscribed to our newsletter.
              </div>
            ) : (
              <form className="flex border border-border-light rounded-sm overflow-hidden" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="w-full px-4 py-2 text-sm focus:outline-none bg-transparent text-primary"
                  required
                />
                <button type="submit" className="bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        <div className="border-t border-border-light pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-text-secondary gap-4">
          <p>&copy; {new Date().getFullYear()} VESatikaa Collections. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
