import { useState } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import './ImageCarousel.css';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  if (!images || images.length === 0) {
    return <div className="carousel-empty">No images available</div>;
  }

  return (
    <div className="carousel-container">
      <div className="carousel-main">
        <img src={images[currentIndex]} alt={`Product image ${currentIndex + 1}`} className="carousel-image" />
        
        {images.length > 1 && (
          <>
            <button className="carousel-btn prev-btn" onClick={prevImage}>
              <CaretLeft size={24} />
            </button>
            <button className="carousel-btn next-btn" onClick={nextImage}>
              <CaretRight size={24} />
            </button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="carousel-thumbnails">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className={`carousel-thumb ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
