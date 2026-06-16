import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import { CaretLeft, CaretRight, ShieldCheck, Truck, ArrowUUpLeft } from '@phosphor-icons/react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { products, loading } = useContext(ProductContext);
  
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Virtual Try-On State
  const [vtonLoading, setVtonLoading] = useState(false);
  const [vtonResult, setVtonResult] = useState(null);
  const [vtonError, setVtonError] = useState(null);
  const [userImageFile, setUserImageFile] = useState(null);
  const [userImagePreview, setUserImagePreview] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.sizes && foundProduct.sizes.length > 0) setSelectedSize(foundProduct.sizes[0]);
        if (foundProduct.colors && foundProduct.colors.length > 0) setSelectedColor(foundProduct.colors[0]);
      }
    }
  }, [id, products]);

  if (loading || !product) {
    return (
      <div className="pt-32 pb-20 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Handle fallback if images array is empty or missing
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handlePrevImage = () => {
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('Please select a size');
      return;
    }
    if (!selectedColor && product.colors && product.colors.length > 0) {
      alert('Please select a color');
      return;
    }
    
    dispatch(addToCart({
      id: product.id || product._id,
      name: product.name,
      image: images[0],
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      qty: quantity,
      countInStock: product.countInStock,
      isAdding: true
    }));
    navigate('/cart');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImageFile(file);
      setUserImagePreview(URL.createObjectURL(file));
      setVtonResult(null); // clear previous result
      setVtonError(null);
    }
  };

  const handleVton = async () => {
    if (!userImageFile) {
      alert("Please upload your photo first!");
      return;
    }
    setVtonLoading(true);
    setVtonError(null);
    try {
      // 1. Fetch garment image as blob
      const garmentRes = await fetch(images[0]);
      const garmentBlob = await garmentRes.blob();

      // 2. Connect to Gradio Client
      const { Client } = await import('@gradio/client');
      const client = await Client.connect("yisol/IDM-VTON");

      // 3. Predict
      const result = await client.predict("/tryon", { 
        dict: {
          background: userImageFile, 
          layers: [],
          composite: null
        },
        garm_img: garmentBlob,
        garment_des: product.name,
        is_checked: true,
        is_checked_crop: false,
        denoise_steps: 30,
        seed: 42,
      });

      if (result.data && result.data[0]) {
        setVtonResult(result.data[0].url || result.data[0]);
      } else {
        throw new Error("Invalid response from IDM-VTON API");
      }

    } catch (err) {
      console.error(err);
      setVtonError("Failed to generate image. The public server might be busy or timing out. Please try again later.");
    } finally {
      setVtonLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 animate-fade-in bg-white min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb */}
        <div className="text-sm text-text-secondary mb-8">
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/')}>Home</span> / 
          <span className="cursor-pointer hover:text-primary mx-1" onClick={() => navigate('/products')}>Products</span> / 
          <span className="text-primary ml-1">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Image Gallery Section */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            {/* Main Image Slider */}
            <div className="relative aspect-[3/4] bg-bg-secondary rounded-sm overflow-hidden group">
              <img 
                src={images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
              />
              
              {/* Slider Controls */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <CaretLeft size={24} />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <CaretRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-24 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-accent opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="lg:w-1/2 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-serif text-primary mb-2">{product.name}</h1>
            <p className="text-xl text-text-secondary mb-6">${product.price.toFixed(2)}</p>
            
            <div className="prose prose-sm text-text-secondary mb-8">
              <p>{product.description}</p>
            </div>

            <hr className="border-border-light mb-8" />

            {/* Selection Form */}
            <div className="space-y-6 mb-8">
              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">Color</h3>
                  <div className="flex gap-3">
                    {product.colors.map(color => (
                      <button 
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-sm border rounded-sm transition-colors ${selectedColor === color ? 'border-primary bg-primary text-white' : 'border-border-light text-text-secondary hover:border-primary'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">Size</h3>
                  <div className="flex gap-3 flex-wrap">
                    {product.sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 flex items-center justify-center text-sm border rounded-sm transition-colors ${selectedSize === size ? 'border-primary bg-primary text-white' : 'border-border-light text-text-secondary hover:border-primary'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">Quantity</h3>
                <div className="flex items-center border border-border-light w-32 rounded-sm">
                  <button 
                    className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    className="w-12 h-10 text-center border-x border-border-light focus:outline-none appearance-none"
                    value={quantity}
                    readOnly
                  />
                  <button 
                    className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                    onClick={() => setQuantity(prev => (product.countInStock && prev >= product.countInStock ? prev : prev + 1))}
                  >
                    +
                  </button>
                </div>
                {product.countInStock !== undefined && product.countInStock < 5 && product.countInStock > 0 && (
                  <p className="text-red-500 text-xs mt-2">Only {product.countInStock} left in stock!</p>
                )}
                {product.countInStock === 0 && (
                  <p className="text-red-500 text-xs mt-2">Out of stock</p>
                )}
              </div>
            </div>

            {/* Virtual Try-On Section */}
            <div className="bg-bg-secondary p-6 border border-border-light rounded-sm mb-8">
              <h3 className="text-lg font-serif text-primary mb-2 flex items-center gap-2">
                ✨ AI Virtual Try-On
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Upload a full-body or half-body photo of yourself to see how this item looks on you instantly!
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-white border border-border-light px-4 py-2 text-sm text-primary hover:border-primary transition-colors rounded-sm shadow-sm">
                    Select Your Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {userImagePreview && (
                    <img src={userImagePreview} alt="You" className="w-12 h-12 object-cover rounded-full border border-border-light shadow-sm" />
                  )}
                </div>

                <button 
                  onClick={handleVton}
                  disabled={vtonLoading || !userImageFile}
                  className="w-full bg-primary text-white py-3 rounded-sm font-medium transition-colors hover:bg-accent disabled:bg-border-light disabled:text-text-secondary disabled:cursor-not-allowed uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-sm"
                >
                  {vtonLoading ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> Generating (~30-60s)...</>
                  ) : "Try It On!"}
                </button>

                {vtonError && (
                  <p className="text-red-500 text-xs text-center">{vtonError}</p>
                )}

                {vtonResult && (
                  <div className="mt-4 animate-fade-in text-center bg-white p-4 rounded-sm border border-border-light shadow-sm">
                    <p className="text-sm font-medium text-primary mb-4">Here is how it looks!</p>
                    <img src={vtonResult} alt="Virtual Try-On Result" className="w-full max-w-sm mx-auto rounded-sm border border-border-light" />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {(!userInfo || !userInfo.isAdmin) && (
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className="flex-1 bg-primary text-white py-4 rounded-sm font-medium transition-colors hover:bg-accent disabled:bg-border-light disabled:text-text-secondary disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  Add to Cart
                </button>
                <button 
                  disabled={product.countInStock === 0}
                  className="flex-1 bg-transparent border border-primary text-primary py-4 rounded-sm font-medium transition-colors hover:bg-bg-secondary disabled:border-border-light disabled:text-text-secondary disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  Buy It Now
                </button>
              </div>
            )}

            {/* Admin Edit Button */}
            {userInfo && userInfo.isAdmin && (
              <button 
                onClick={() => navigate('/admin')}
                className="w-full bg-bg-secondary text-primary border border-border-light py-4 rounded-sm font-medium transition-colors hover:bg-border-light uppercase tracking-wider text-sm mb-10"
              >
                Edit Product in Admin Dashboard
              </button>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border-light pt-8">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={24} className="text-primary" />
                <span className="text-xs text-text-secondary uppercase tracking-wider">Free Global Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ArrowUUpLeft size={24} className="text-primary" />
                <span className="text-xs text-text-secondary uppercase tracking-wider">30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck size={24} className="text-primary" />
                <span className="text-xs text-text-secondary uppercase tracking-wider">Authenticity Guaranteed</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
