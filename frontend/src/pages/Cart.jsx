import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, clearCartItems } from '../redux/slices/cartSlice';
import { Trash, ShoppingBag } from '@phosphor-icons/react';

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

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty, isAdding: false }));
  };

  const removeFromCartHandler = (id, size, color) => {
    dispatch(removeFromCart({ id, size, color }));
  };

  const { userInfo } = useSelector((state) => state.auth);

  const checkoutHandler = async () => {
    if (!userInfo) {
      navigate('/auth?redirect=/cart');
      return;
    }

    try {
      // 1. Create the Order in the DB first with a placeholder address since we're bypassing the checkout form
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
          shippingAddress: { address: 'Not Provided', city: 'Not Provided', postalCode: '000000', country: 'Not Provided' },
          paymentMethod: 'Razorpay',
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.message || 'Something went wrong while placing order');
      }

      // 2. Load Razorpay Script
      const resScript = await loadRazorpayScript();
      if (!resScript) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      // 3. Fetch Razorpay Key
      //const API_URL = import.meta.env.VITE_API_URL || '';
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

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-bg-secondary animate-fade-in">
      <div className="container mx-auto px-4">

        <h1 className="text-4xl font-serif text-primary mb-8 border-b border-border-light pb-4 flex items-center gap-3">
          <ShoppingBag size={36} /> Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-md shadow-sm border border-border-light p-12 text-center max-w-2xl mx-auto">
            <ShoppingBag size={64} className="text-text-secondary mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-serif text-primary mb-4">Your cart is currently empty</h2>
            <p className="text-text-secondary mb-8">Discover our latest collections to find your perfect style.</p>
            <Link to="/products" className="bg-primary text-white py-3 px-8 rounded-sm font-medium transition-colors hover:bg-accent inline-block">
              Shop Collections
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Cart Items */}
            <div className="lg:w-2/3 flex flex-col gap-4">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="bg-white rounded-md shadow-sm border border-border-light p-4 flex flex-col sm:flex-row gap-6 items-center relative pr-12">
                  <img src={item.image} alt={item.name} className="w-24 h-32 object-cover rounded-sm" />

                  <div className="flex-1 text-center sm:text-left">
                    <Link to={`/product/${item.id}`} className="text-xl font-serif text-primary hover:text-accent transition-colors block mb-1">
                      {item.name}
                    </Link>
                    <p className="text-text-secondary text-sm mb-2">
                      {item.color && <span className="mr-3">Color: {item.color}</span>}
                      {item.size && <span>Size: {item.size}</span>}
                    </p>
                    <p className="text-accent font-medium">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-border-light rounded-sm h-10 w-28">
                      <button
                        className="w-8 flex items-center justify-center text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
                        onClick={() => addToCartHandler(item, item.qty - 1)}
                        disabled={item.qty <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.countInStock}
                        className="w-12 text-center border-x border-border-light h-full focus:outline-none bg-transparent appearance-none"
                        value={item.qty || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            // Allow it to be temporarily empty while typing, but default to 1 in the handler to prevent NaN errors
                            addToCartHandler(item, val);
                            return;
                          }
                          const num = parseInt(val);
                          if (!isNaN(num) && num > 0) {
                            addToCartHandler(item, Math.min(num, item.countInStock));
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === '' || e.target.value < 1) {
                            addToCartHandler(item, 1);
                          }
                        }}
                      />
                      <button
                        className="w-8 flex items-center justify-center text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
                        onClick={() => addToCartHandler(item, item.qty + 1)}
                        disabled={item.countInStock <= item.qty}
                      >
                        +
                      </button>
                    </div>

                    <p className="font-medium text-primary w-20 text-right hidden sm:block">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCartHandler(item.id, item.size, item.color)}
                    className="absolute right-4 top-4 sm:top-1/2 sm:-translate-y-1/2 text-text-secondary hover:text-red-500 transition-colors p-2"
                    title="Remove item"
                  >
                    <Trash size={24} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-md shadow-sm border border-border-light p-6 sticky top-28">
                <h2 className="text-2xl font-serif text-primary mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 text-sm text-text-secondary border-b border-border-light pb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                    <span className="font-medium text-primary">${cart.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-primary">${cart.shippingPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (15%)</span>
                    <span className="font-medium text-primary">${cart.taxPrice}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="text-primary font-medium">Total</span>
                  <span className="text-3xl font-serif text-accent">${cart.totalPrice}</span>
                </div>

                <button
                  type="button"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                  className="w-full bg-primary text-white py-4 rounded-sm font-medium transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider mb-4"
                >
                  BUY NOW
                </button>

                <p className="text-xs text-center text-text-secondary">
                  Taxes and shipping calculated at checkout.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
