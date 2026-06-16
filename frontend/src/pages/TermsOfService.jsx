import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-white animate-fade-in">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-serif text-primary mb-8 border-b border-border-light pb-4">Terms of Service</h1>
        
        <div className="prose prose-sm md:prose-base text-text-secondary">
          <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-serif text-primary mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using the VESatikaa Collections website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-8 mb-4">2. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily download one copy of the materials (information or software) on VESatikaa Collections' website for personal, non-commercial transitory viewing only.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-8 mb-4">3. Disclaimer</h2>
          <p className="mb-4">
            The materials on VESatikaa Collections' website are provided on an 'as is' basis. VESatikaa Collections makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-8 mb-4">4. Limitations</h2>
          <p className="mb-4">
            In no event shall VESatikaa Collections or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on VESatikaa Collections' website.
          </p>

          <h2 className="text-2xl font-serif text-primary mt-8 mb-4">5. Revisions and Errata</h2>
          <p className="mb-4">
            The materials appearing on VESatikaa Collections' website could include technical, typographical, or photographic errors. VESatikaa Collections does not warrant that any of the materials on its website are accurate, complete, or current.
          </p>
          
          <h2 className="text-2xl font-serif text-primary mt-8 mb-4">6. Modifications</h2>
          <p className="mb-4">
            VESatikaa Collections may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
