import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-white animate-fade-in">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-serif text-primary mb-8 border-b border-border-light pb-4">Privacy Policy</h1>
        
        <div className="prose prose-sm md:prose-base text-text-secondary">
          <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-serif text-primary mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            At VESatikaa Collections, we collect information that you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact customer support. This may include your name, email address, phone number, shipping address, and payment information.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to process your orders, communicate with you about your purchases, provide customer support, and send you marketing communications (if you have opted in). We also use this information to improve our website and services.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-8 mb-4">3. Virtual Try-On Feature</h2>
          <p className="mb-4">
            If you use our AI Virtual Try-On feature, the photos you upload are temporarily sent to a secure external service (IDM-VTON API) solely for the purpose of generating the try-on image. We do not permanently store these images on our servers, nor do we use them for any other purpose.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-8 mb-4">4. Information Sharing</h2>
          <p className="mb-4">
            We do not sell your personal information. We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-8 mb-4">5. Security</h2>
          <p className="mb-4">
            We implement a variety of security measures to maintain the safety of your personal information. All transactions are processed through a gateway provider and are not stored or processed on our servers.
          </p>
          
          <h2 className="text-2xl font-serif text-primary mt-8 mb-4">6. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us through our Contact page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
