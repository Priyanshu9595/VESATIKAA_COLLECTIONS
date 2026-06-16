import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { List, X, CaretDown, User, ShoppingBag } from '@phosphor-icons/react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { clearCartItems } from '../redux/slices/cartSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartItems());
    setDropdownOpen(false);
    navigate('/');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        // Also ensure we don't close it if clicking the hamburger icon itself
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border-light shadow-sm transition-all">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Mobile Menu Button (Left on Mobile) */}
        <div className="flex items-center md:hidden w-1/4" ref={mobileMenuRef}>
          <button className="text-primary p-2 -ml-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <List size={28} />}
          </button>
        </div>

        {/* Logo (Center on Mobile, Left on Desktop) */}
        <div className="flex-shrink-0 flex items-center justify-center w-1/2 md:w-auto">
          <Link to="/" className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-primary no-underline whitespace-nowrap">
            VESatikaa<span className="text-accent font-normal">Collections</span>
          </Link>
        </div>

        {/* Mobile Right Actions (Cart) */}
        <div className="flex items-center justify-end md:hidden w-1/4">
          {(!userInfo || !userInfo.isAdmin) && (
            <Link to="/cart" className="text-primary p-2 hover:text-accent transition-colors flex items-center">
              <span className="relative">
                <ShoppingBag size={26} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </span>
            </Link>
          )}
        </div>

        {/* Desktop Center Links */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-8">
          <Link to="/" className="text-primary font-medium hover:text-accent transition-colors">Home</Link>
          <Link to="/portfolio" className="text-primary font-medium hover:text-accent transition-colors">Portfolio</Link>
          <Link to="/products" className="text-primary font-medium hover:text-accent transition-colors">Products</Link>
          
          {userInfo && userInfo.isAdmin && (
            <Link to="/admin" className="text-primary font-medium hover:text-accent transition-colors text-accent">Admin Panel</Link>
          )}
          
          {/* Cart */}
          {(!userInfo || !userInfo.isAdmin) && (
            <Link to="/cart" className="text-primary font-medium hover:text-accent transition-colors flex items-center gap-1">
              Cart {cartCount > 0 && <span className="bg-accent text-white text-[10px] px-1.5 py-0.5 rounded-full">{cartCount}</span>}
            </Link>
          )}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center justify-end gap-6">

          {/* Unified Auth Menu */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center gap-1 text-primary font-medium hover:text-accent transition-colors" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {userInfo ? (
                <span className="flex items-center gap-1">{userInfo.name} <CaretDown size={16} /></span>
              ) : (
                <User size={24} />
              )}
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-4 w-48 bg-white rounded-md shadow-lg border border-border-light py-2 z-50">
                {userInfo ? (
                  <button className="w-full text-left px-4 py-2 text-primary hover:bg-bg-secondary transition-colors" onClick={handleLogout}>Logout</button>
                ) : (
                  <>
                    <Link to="/auth" className="block px-4 py-2 text-primary hover:bg-bg-secondary transition-colors" onClick={() => setDropdownOpen(false)}>As a User</Link>
                    <Link to="/auth?admin=true" className="block px-4 py-2 text-primary hover:bg-bg-secondary transition-colors" onClick={() => setDropdownOpen(false)}>As an Admin</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu (Only visible when isOpen is true on mobile) */}
        {isOpen && (
          <div className="absolute top-20 left-0 w-full bg-white shadow-md border-t border-border-light flex flex-col p-6 md:hidden z-40">
            <Link to="/" className="py-3 border-b border-border-light text-primary font-medium" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/portfolio" className="py-3 border-b border-border-light text-primary font-medium" onClick={() => setIsOpen(false)}>Portfolio</Link>
            <Link to="/products" className="py-3 border-b border-border-light text-primary font-medium" onClick={() => setIsOpen(false)}>Products</Link>
            {(!userInfo || !userInfo.isAdmin) && (
              <Link to="/cart" className="py-3 border-b border-border-light text-primary font-medium" onClick={() => setIsOpen(false)}>
                Cart {cartCount > 0 && <span className="ml-2 bg-accent text-white text-[10px] px-1.5 py-0.5 rounded-full">{cartCount}</span>}
              </Link>
            )}
            {userInfo ? (
              <button className="w-full text-left py-3 border-b border-border-light text-primary font-medium" onClick={handleLogout}>Logout ({userInfo.name})</button>
            ) : (
              <>
                <Link to="/auth" className="py-3 border-b border-border-light text-primary font-medium" onClick={() => setIsOpen(false)}>Sign In as User</Link>
                <Link to="/auth?admin=true" className="py-3 text-primary font-medium" onClick={() => setIsOpen(false)}>Sign In as Admin</Link>
              </>
            )}
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
