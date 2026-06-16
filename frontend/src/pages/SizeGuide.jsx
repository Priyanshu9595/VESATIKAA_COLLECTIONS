import React from 'react';

const SizeGuide = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-bg-secondary animate-fade-in">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-serif text-primary mb-8 text-center uppercase tracking-wider">Size Guide</h1>
        
        <div className="bg-white p-8 rounded-md shadow-sm border border-border-light mb-12">
          <p className="text-text-secondary text-center mb-8 leading-relaxed max-w-2xl mx-auto">
            At VESatikaa Collections, our garments are crafted with precision to ensure a flawless fit. 
            Please refer to the sizing charts below before making your purchase. If you require custom 
            tailoring, please contact our support team.
          </p>

          <h2 className="text-2xl font-serif text-primary mb-6 border-b border-border-light pb-2">Women's Dresses (Standard)</h2>
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-left text-sm text-text-secondary border-collapse">
              <thead>
                <tr className="bg-bg-secondary text-primary font-medium uppercase tracking-wider">
                  <th className="p-4 border border-border-light">Size</th>
                  <th className="p-4 border border-border-light">US</th>
                  <th className="p-4 border border-border-light">UK</th>
                  <th className="p-4 border border-border-light">Bust (in)</th>
                  <th className="p-4 border border-border-light">Waist (in)</th>
                  <th className="p-4 border border-border-light">Hips (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border border-border-light font-medium text-primary">XS</td>
                  <td className="p-4 border border-border-light">2</td>
                  <td className="p-4 border border-border-light">6</td>
                  <td className="p-4 border border-border-light">32</td>
                  <td className="p-4 border border-border-light">24</td>
                  <td className="p-4 border border-border-light">34</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 border border-border-light font-medium text-primary">S</td>
                  <td className="p-4 border border-border-light">4</td>
                  <td className="p-4 border border-border-light">8</td>
                  <td className="p-4 border border-border-light">34</td>
                  <td className="p-4 border border-border-light">26</td>
                  <td className="p-4 border border-border-light">36</td>
                </tr>
                <tr>
                  <td className="p-4 border border-border-light font-medium text-primary">M</td>
                  <td className="p-4 border border-border-light">6</td>
                  <td className="p-4 border border-border-light">10</td>
                  <td className="p-4 border border-border-light">36</td>
                  <td className="p-4 border border-border-light">28</td>
                  <td className="p-4 border border-border-light">38</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 border border-border-light font-medium text-primary">L</td>
                  <td className="p-4 border border-border-light">8</td>
                  <td className="p-4 border border-border-light">12</td>
                  <td className="p-4 border border-border-light">38</td>
                  <td className="p-4 border border-border-light">30</td>
                  <td className="p-4 border border-border-light">40</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-serif text-primary mb-6 border-b border-border-light pb-2">Men's Suits (Tailored)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-secondary border-collapse">
              <thead>
                <tr className="bg-bg-secondary text-primary font-medium uppercase tracking-wider">
                  <th className="p-4 border border-border-light">Jacket Size</th>
                  <th className="p-4 border border-border-light">Chest (in)</th>
                  <th className="p-4 border border-border-light">Waist (in)</th>
                  <th className="p-4 border border-border-light">Shoulder (in)</th>
                  <th className="p-4 border border-border-light">Sleeve (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border border-border-light font-medium text-primary">38R</td>
                  <td className="p-4 border border-border-light">38</td>
                  <td className="p-4 border border-border-light">32</td>
                  <td className="p-4 border border-border-light">17.5</td>
                  <td className="p-4 border border-border-light">25</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 border border-border-light font-medium text-primary">40R</td>
                  <td className="p-4 border border-border-light">40</td>
                  <td className="p-4 border border-border-light">34</td>
                  <td className="p-4 border border-border-light">18</td>
                  <td className="p-4 border border-border-light">25.5</td>
                </tr>
                <tr>
                  <td className="p-4 border border-border-light font-medium text-primary">42R</td>
                  <td className="p-4 border border-border-light">42</td>
                  <td className="p-4 border border-border-light">36</td>
                  <td className="p-4 border border-border-light">18.5</td>
                  <td className="p-4 border border-border-light">26</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 border border-border-light font-medium text-primary">44R</td>
                  <td className="p-4 border border-border-light">44</td>
                  <td className="p-4 border border-border-light">38</td>
                  <td className="p-4 border border-border-light">19</td>
                  <td className="p-4 border border-border-light">26.5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <p className="text-text-secondary mb-4">Still unsure about your size?</p>
          <a href="/contact" className="inline-block bg-primary text-white px-8 py-3 uppercase tracking-wider text-sm hover:bg-accent transition-colors">
            Contact a Stylist
          </a>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
