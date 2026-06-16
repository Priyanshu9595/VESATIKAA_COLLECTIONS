import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilSimple, Trash, Plus } from '@phosphor-icons/react';
import { useSelector } from 'react-redux';
import { ProductContext } from '../context/ProductContext';

const AdminDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { products, fetchProducts } = useContext(ProductContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    category: '',
    collectionName: '',
    description: '',
    images: '', // we will parse this by comma
    countInStock: 0,
  });

  useEffect(() => {
    // Redirect if not admin
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
      return;
    }
  }, [userInfo, navigate]);


  const handleEdit = (product) => {
    setFormData({
      ...product,
      images: product.images ? product.images.join(', ') : '',
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${API_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        if (res.ok) {
          fetchProducts();
        } else {
          alert('Failed to delete product');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: '', name: '', price: '', category: '', collectionName: '', description: '', images: '', countInStock: 0,
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formattedProduct = {
      ...formData,
      price: parseFloat(formData.price),
      countInStock: parseInt(formData.countInStock),
      images: formData.images.split(',').map(url => url.trim()).filter(url => url !== '')
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      if (isEditing) {
        await fetch(`${API_URL}/api/products/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify(formattedProduct),
        });
      } else {
        await fetch(`${API_URL}/api/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify(formattedProduct),
        });
      }
      fetchProducts();
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    }
  };

  if (!userInfo || !userInfo.isAdmin) return null;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-bg-secondary animate-fade-in">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-primary mb-2">Admin Dashboard</h1>
          <p className="text-text-secondary">Manage products and collections</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Form */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-md shadow-sm border border-border-light sticky top-28">
              <h2 className="text-xl font-serif text-primary mb-6 border-b border-border-light pb-2">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Product Name</label>
                  <input type="text" name="name" className="w-full p-2 border border-border-light rounded-sm focus:outline-none focus:border-accent" value={formData.name} onChange={handleChange} required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Price ($)</label>
                    <input type="number" name="price" step="0.01" className="w-full p-2 border border-border-light rounded-sm focus:outline-none focus:border-accent" value={formData.price} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Stock</label>
                    <input type="number" name="countInStock" className="w-full p-2 border border-border-light rounded-sm focus:outline-none focus:border-accent" value={formData.countInStock} onChange={handleChange} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Category</label>
                    <input type="text" name="category" className="w-full p-2 border border-border-light rounded-sm focus:outline-none focus:border-accent" value={formData.category} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Collection</label>
                    <input type="text" name="collectionName" className="w-full p-2 border border-border-light rounded-sm focus:outline-none focus:border-accent" value={formData.collectionName} onChange={handleChange} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Image URLs (comma separated)</label>
                  <textarea name="images" rows="2" className="w-full p-2 border border-border-light rounded-sm focus:outline-none focus:border-accent text-sm" value={formData.images} onChange={handleChange} required placeholder="https://image1.jpg, https://image2.jpg"></textarea>
                </div>
                
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Description</label>
                  <textarea name="description" rows="3" className="w-full p-2 border border-border-light rounded-sm focus:outline-none focus:border-accent text-sm" value={formData.description} onChange={handleChange} required></textarea>
                </div>
                
                <div className="flex gap-4 pt-2">
                  <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-sm font-medium transition-colors hover:bg-accent flex items-center justify-center gap-2">
                    {isEditing ? 'Update Product' : <><Plus size={18} /> Add Product</>}
                  </button>
                  {isEditing && (
                    <button type="button" className="flex-1 bg-white border border-border-light text-primary py-2 rounded-sm font-medium transition-colors hover:bg-bg-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:w-2/3">
            <div className="bg-white p-6 rounded-md shadow-sm border border-border-light">
              <h2 className="text-xl font-serif text-primary mb-6 border-b border-border-light pb-2">Product Inventory</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-light">
                      <th className="py-3 px-2 text-sm font-medium text-text-secondary">Image</th>
                      <th className="py-3 px-2 text-sm font-medium text-text-secondary">Name</th>
                      <th className="py-3 px-2 text-sm font-medium text-text-secondary">Category</th>
                      <th className="py-3 px-2 text-sm font-medium text-text-secondary">Price</th>
                      <th className="py-3 px-2 text-sm font-medium text-text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b border-border-light hover:bg-bg-secondary transition-colors">
                        <td className="py-2 px-2">
                          <img src={product.images && product.images[0]} alt={product.name} className="w-12 h-16 object-cover rounded-sm border border-border-light" />
                        </td>
                        <td className="py-2 px-2 text-sm text-primary font-medium">{product.name}</td>
                        <td className="py-2 px-2 text-sm text-text-secondary">{product.category}</td>
                        <td className="py-2 px-2 text-sm text-primary font-medium">${product.price.toFixed(2)}</td>
                        <td className="py-2 px-2">
                          <div className="flex gap-3">
                            <button className="text-sm font-medium text-accent hover:text-primary transition-colors" onClick={() => handleEdit(product)}>
                              Edit
                            </button>
                            <button className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors" onClick={() => handleDelete(product.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-text-secondary">No products found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
