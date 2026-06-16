import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { EnvelopeSimple, Phone, MapPin, LockKey } from '@phosphor-icons/react';

const Contact = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ 
    name: userInfo?.name || '', 
    email: userInfo?.email || '', 
    subject: '', 
    message: '' 
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (userInfo) {
      setFormData(prev => ({
        ...prev,
        name: userInfo.name || prev.name,
        email: userInfo.email || prev.email
      }));
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Sending message...' });

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus({ type: 'success', message: 'Thank you for your message. Our team will get back to you shortly.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please try again later.' });
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-bg-secondary animate-fade-in">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-primary mb-2">Contact Us</h1>
          <p className="text-text-secondary">For inquiries regarding our collections, private styling, or order assistance.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Contact Info */}
          <div className="md:w-1/3 space-y-6">
            <div className="bg-white p-6 rounded-md shadow-sm border border-border-light">
              <div className="flex items-start gap-4 mb-4">
                <MapPin size={24} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-primary text-lg mb-1">Boutique Location</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    123 Fashion Avenue<br/>
                    New York, NY 10001<br/>
                    United States
                  </p>
                </div>
              </div>

              <hr className="border-border-light my-4" />

              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 mt-1 w-6"></div>
                <div>
                  <h3 className="font-serif text-primary text-lg mb-1">Opening Hours</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Mon - Fri: 10:00 AM - 7:00 PM<br/>
                    Saturday: 11:00 AM - 6:00 PM<br/>
                    Sunday: Closed
                  </p>
                </div>
              </div>

              <hr className="border-border-light my-4" />

              <div className="flex items-start gap-4">
                <Phone size={24} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-primary text-lg mb-1">Direct Contact</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-1">
                    clientcare@vesatikaa.co.in
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:w-2/3">
            <div className="bg-white p-8 rounded-md shadow-sm border border-border-light">
              <h2 className="text-2xl font-serif text-primary mb-6">Send an Inquiry</h2>
              
              {status.message && (
                <div className={`p-4 mb-6 rounded-sm text-sm font-medium ${
                  status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
                  status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
                  'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {status.message}
                </div>
              )}

              {!userInfo ? (
                <div className="bg-bg-secondary p-8 rounded-sm text-center border border-border-light">
                  <LockKey size={48} className="mx-auto text-text-secondary mb-4" />
                  <h3 className="text-xl font-serif text-primary mb-2">Authentication Required</h3>
                  <p className="text-text-secondary mb-6">Please log in to your account to send us an inquiry.</p>
                  <Link to="/auth?redirect=/contact" className="inline-block bg-primary text-white py-3 px-8 rounded-sm font-medium transition-colors hover:bg-accent tracking-wider">
                    Sign In to Continue
                  </Link>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm text-text-secondary mb-1">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      className="w-full p-3 border border-border-light rounded-sm focus:outline-none focus:border-accent" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm text-text-secondary mb-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      className="w-full p-3 border border-border-light rounded-sm focus:outline-none focus:border-accent" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm text-text-secondary mb-1">Subject</label>
                  <select 
                    id="subject" 
                    name="subject" 
                    className="w-full p-3 border border-border-light rounded-sm focus:outline-none focus:border-accent bg-white" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="" disabled>Select a subject</option>
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="Order Status">Order Status</option>
                    <option value="Private Styling">Private Styling Appointment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm text-text-secondary mb-1">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5" 
                    className="w-full p-3 border border-border-light rounded-sm focus:outline-none focus:border-accent" 
                    value={formData.message} 
                    onChange={handleChange} 
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={status.type === 'loading'}
                  className="w-full bg-primary text-white py-4 rounded-sm font-medium transition-colors hover:bg-accent disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <EnvelopeSimple size={20} />
                  {status.type === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
