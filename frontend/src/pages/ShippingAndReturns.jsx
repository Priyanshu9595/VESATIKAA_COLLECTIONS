import React from 'react';

const ShippingAndReturns = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-white animate-fade-in">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-serif text-primary mb-8 border-b border-border-light pb-4">Shipping & Returns</h1>
        
        <div className="prose prose-sm md:prose-base text-text-secondary">
          <h2 className="text-2xl font-serif text-primary mt-8 mb-4">Shipping Policy</h2>
          
          <h3 className="text-xl font-medium text-primary mt-6 mb-2">Free Global Shipping</h3>
          <p className="mb-4">
            We are proud to offer complimentary express shipping on all orders worldwide. Every piece is carefully packaged in our signature VESatikaa boxes to ensure it arrives in pristine condition.
          </p>

          <h3 className="text-xl font-medium text-primary mt-6 mb-2">Processing Times</h3>
          <p className="mb-4">
            Orders are processed and dispatched within 1-2 business days. For customized or made-to-order items, please allow an additional 5-7 business days for our artisans to craft your piece.
          </p>

          <h3 className="text-xl font-medium text-primary mt-6 mb-2">Estimated Delivery</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>North America:</strong> 2-3 business days</li>
            <li><strong>Europe:</strong> 2-4 business days</li>
            <li><strong>Asia Pacific:</strong> 3-5 business days</li>
            <li><strong>Rest of the World:</strong> 4-7 business days</li>
          </ul>

          <hr className="my-12 border-border-light" />

          <h2 className="text-2xl font-serif text-primary mt-8 mb-4">Returns & Exchanges</h2>

          <h3 className="text-xl font-medium text-primary mt-6 mb-2">30-Day Return Policy</h3>
          <p className="mb-4">
            If you are not entirely satisfied with your purchase, we offer a 30-day return policy from the date of delivery. Items must be returned in their original, unworn condition with all VESatikaa tags and security seals still attached.
          </p>

          <h3 className="text-xl font-medium text-primary mt-6 mb-2">How to Initiate a Return</h3>
          <ol className="list-decimal pl-6 mb-4 space-y-2">
            <li>Log into your account and navigate to your Order History.</li>
            <li>Select the order containing the item(s) you wish to return.</li>
            <li>Click "Request Return" and follow the instructions to generate your prepaid shipping label.</li>
            <li>Carefully pack the item in its original packaging and attach the label.</li>
            <li>Drop off the package at your nearest authorized courier location.</li>
          </ol>

          <h3 className="text-xl font-medium text-primary mt-6 mb-2">Refunds</h3>
          <p className="mb-4">
            Once your return is received and inspected by our quality control team, we will process your refund to the original payment method within 3-5 business days. You will receive an email confirmation once the refund has been issued.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingAndReturns;
