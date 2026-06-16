import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';

const Auth = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isRegisterParam = searchParams.get('register') === 'true';
  const isAdminParam = searchParams.get('admin') === 'true';

  const [isLogin, setIsLogin] = useState(!isRegisterParam);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [navigate, userInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Admin Domain Validation
    if (isAdminParam && !formData.email.endsWith('@vesatikaa.co.in')) {
      setError('Admin emails must end with @vesatikaa.co.in');
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const url = isLogin ? `${API_URL}/api/users/login` : `${API_URL}/api/users`;
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password, isAdmin: isAdminParam };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      dispatch(setCredentials(data));
      // Navigation is handled by useEffect
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center items-center bg-bg-secondary px-4 animate-fade-in">
      <div className="bg-white p-8 rounded-md shadow-sm border border-border-light w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-primary mb-2">
            {isAdminParam ? 'Admin Portal' : (isLogin ? 'Welcome Back' : 'Create an Account')}
          </h2>
          <p className="text-text-secondary">
            {isAdminParam 
              ? 'Sign in to access the dashboard' 
              : (isLogin ? 'Sign in to access your account' : 'Join VESatikaa Collections for exclusive access')
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex border-b border-border-light mb-6">
          <button 
            className={`flex-1 py-2 font-medium transition-colors ${isLogin ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-primary'}`} 
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Sign In
          </button>
          <button 
            className={`flex-1 py-2 font-medium transition-colors ${!isLogin ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-primary'}`} 
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-text-secondary mb-1" htmlFor="name">Full Name</label>
              <input 
                className="w-full p-3 border border-border-light rounded-sm focus:outline-none focus:border-accent transition-colors"
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm text-text-secondary mb-1" htmlFor="email">Email Address</label>
            <input 
              className="w-full p-3 border border-border-light rounded-sm focus:outline-none focus:border-accent transition-colors"
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm text-text-secondary mb-1" htmlFor="password">Password</label>
            <input 
              className="w-full p-3 border border-border-light rounded-sm focus:outline-none focus:border-accent transition-colors"
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-white py-3 px-6 rounded-sm font-medium transition-colors hover:bg-accent disabled:opacity-50 mt-6"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
