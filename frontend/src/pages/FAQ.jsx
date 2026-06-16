import React, { useState } from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border-light py-4">
      <button 
        className="w-full flex justify-between items-center text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-serif text-lg text-primary">{question}</h3>
        <span className="text-accent ml-4">
          {isOpen ? <CaretUp size={20} /> : <CaretDown size={20} />}
        </span>
      </button>
      {isOpen && (
        <div className="mt-4 text-text-secondary text-sm leading-relaxed animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship globally via expedited luxury courier services. International shipping typically takes 3-7 business days depending on the destination. All duties and taxes are calculated at checkout so there are no hidden fees upon delivery."
    },
    {
      question: "What is your return and exchange policy?",
      answer: "We offer complimentary returns within 14 days of delivery. Items must be in unworn, pristine condition with all original tags and security ribbons attached. Bespoke or tailored items are non-refundable."
    },
    {
      question: "How do I care for my tailored suits and silk dresses?",
      answer: "We strongly recommend professional dry cleaning only for our tailored suits, silk garments, and cashmere pieces. Never machine wash or tumble dry luxury fabrics. A specialized care guide is included with every purchase."
    },
    {
      question: "Can I request bespoke alterations?",
      answer: "Absolutely. We offer a bespoke tailoring service for our VIP clientele. If you require specific measurements, please contact our support team to schedule a virtual consultation with our master tailors before placing your order."
    },
    {
      question: "How long does a refund take to process?",
      answer: "Once our atelier receives and inspects the returned item, a refund will be issued to your original payment method within 5-7 business days."
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-bg-secondary animate-fade-in">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-serif text-primary mb-2 text-center uppercase tracking-wider">Frequently Asked Questions</h1>
        <p className="text-text-secondary text-center mb-12">Everything you need to know about shopping with VESatikaa.</p>
        
        <div className="bg-white p-6 md:p-10 rounded-md shadow-sm border border-border-light">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-text-secondary mb-4">Cannot find the answer you are looking for?</p>
          <a href="/contact" className="inline-block bg-primary text-white px-8 py-3 uppercase tracking-wider text-sm hover:bg-accent transition-colors">
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
