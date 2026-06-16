import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress, savePaymentMethod, clearCartItems } from '../redux/slices/cartSlice';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = cart;
  const { userInfo } = useSelector((state) => state.auth);

  const [address, setAddress] = useState(shippingAddress.address || '123 Test Street');
  const [city, setCity] = useState(shippingAddress.city || 'Test City');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '123456');
  const [country, setCountry] = useState(shippingAddress.country || 'Test Country');
  const [payment, setPayment] = useState(paymentMethod || 'Credit Card');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // If user is not logged in, they shouldn't be here (protected by route or redirect)
  if (!userInfo) {
    navigate('/auth?redirect=/checkout');
  }

  const submitOrderHandler = async (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(payment));

    try {
      // 1. Create the Order in the DB first
      const API_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems.map(item => ({
            ...item,
            product: item.id
          })),
          shippingAddress: { address, city, postalCode, country },
          paymentMethod: payment,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.message || 'Something went wrong while placing order');
      }

      if (payment === 'Razorpay') {
        // 2. Load Razorpay Script
        const resScript = await loadRazorpayScript();
        if (!resScript) {
          alert('Razorpay SDK failed to load. Are you online?');
          return;
        }

        // 3. Fetch Razorpay Key
        const API_URL = import.meta.env.VITE_API_URL || '';
        const keyRes = await fetch(`${API_URL}/api/config/razorpay`);
        const keyText = await keyRes.text();
        const keyId = keyText.trim();

        // 4. Generate Razorpay Order
        const rzpOrderRes = await fetch(`${API_URL}/api/orders/${orderData.id}/razorpay-order`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const rzpOrderData = await rzpOrderRes.json();

        if (!rzpOrderRes.ok) {
          throw new Error(rzpOrderData.message || 'Failed to create Razorpay order');
        }

        // 5. Open Razorpay Checkout Modal
        const options = {
          key: keyId,
          amount: rzpOrderData.amount,
          currency: rzpOrderData.currency,
          name: 'VESatikaa Collections',
          description: 'Luxury Fashion Order',
          order_id: rzpOrderData.id,
          handler: async function (response) {
            // 6. Verify Payment
            try {
              const verifyRes = await fetch(`${API_URL}/api/orders/${orderData.id}/pay`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok) {
                dispatch(clearCartItems());
                alert('Payment successful! Order placed.');
                navigate('/myorders');
              } else {
                alert(verifyData.message || 'Payment verification failed');
              }
            } catch (err) {
              alert(err.message);
            }
          },
          prefill: {
            name: userInfo.name,
            email: userInfo.email,
          },
          theme: {
            color: '#1A1A1A',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

      } else {
        // Handle other payment methods (e.g. PayPal/Credit Card dummy implementation)
        dispatch(clearCartItems());
        navigate(`/myorders`); 
        alert('Order placed successfully!');
      }

    } catch (error) {
      alert(error.message);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-bg-secondary animate-fade-in">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-serif text-primary mb-8 text-center">Secure Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={submitOrderHandler} className="bg-white p-6 md:p-8 rounded-md shadow-sm border border-border-light space-y-8">
              
              {/* Shipping Address */}
              <div>
                <h2 className="text-xl font-serif text-primary mb-4 border-b border-border-light pb-2">1. Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Street Address</label>
                    <input 
                      type="text" 
                      className="w-full p-3 border border-border-light rounded-sm focus:outline-none focus:border-accent"
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">City</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-border-light rounded-sm focus:outline-none focus:border-accent"
                        value={city} 
                        onChange={(e) => setCity(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Postal Code</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-border-light rounded-sm focus:outline-none focus:border-accent"
                        value={postalCode} 
                        onChange={(e) => setPostalCode(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Country</label>
                    <input 
                      type="text" 
                      className="w-full p-3 border border-border-light rounded-sm focus:outline-none focus:border-accent"
                      value={country} 
                      onChange={(e) => setCountry(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-serif text-primary mb-4 border-b border-border-light pb-2">2. Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-border-light rounded-sm cursor-pointer hover:border-primary transition-colors">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Razorpay" 
                      checked={payment === 'Razorpay'} 
                      onChange={(e) => setPayment(e.target.value)} 
                      className="w-4 h-4 text-accent"
                    />
                    <span className="text-primary font-medium">Razorpay (Credit/Debit Cards, UPI, NetBanking)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-border-light rounded-sm cursor-pointer hover:border-primary transition-colors">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Credit Card" 
                      checked={payment === 'Credit Card'} 
                      onChange={(e) => setPayment(e.target.value)} 
                      className="w-4 h-4 text-accent"
                    />
                    <span className="text-primary font-medium">Credit Card</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-border-light rounded-sm cursor-pointer hover:border-primary transition-colors">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="PayPal" 
                      checked={payment === 'PayPal'} 
                      onChange={(e) => setPayment(e.target.value)} 
                      className="w-4 h-4 text-accent"
                    />
                    <span className="text-primary font-medium">PayPal</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary text-white py-4 rounded-sm font-medium transition-colors hover:bg-accent uppercase tracking-wider text-lg mt-8"
              >
                {payment === 'Razorpay' ? 'Pay with Razorpay' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-md shadow-sm border border-border-light sticky top-28">
              <h2 className="text-xl font-serif text-primary mb-4 border-b border-border-light pb-2">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-sm border border-border-light" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary line-clamp-2">{item.name}</p>
                      <p className="text-xs text-text-secondary mt-1">Qty: {item.qty}</p>
                      <p className="text-sm font-medium text-accent mt-1">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm text-text-secondary border-t border-border-light pt-4 mb-4">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span className="font-medium text-primary">${itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-primary">${shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-medium text-primary">${taxPrice}</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-border-light pt-4 mb-6">
                <span className="text-primary font-medium text-lg">Order Total</span>
                <span className="text-2xl font-serif text-accent">${totalPrice}</span>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
