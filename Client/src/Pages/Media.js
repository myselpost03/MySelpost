import React, { useState } from 'react';
import Header from "../Components/Header";
import '../Styles/Media.css';

const IMAGES = [
  { id: 1, url: 'https://picsum.photos/id/10/800/600', title: 'Mountain Mist' },
  { id: 2, url: 'https://picsum.photos/id/20/800/600', title: 'Deep Forest' },
  { id: 3, url: 'https://picsum.photos/id/26/800/600', title: 'Quiet Stream' },
  { id: 4, url: 'https://picsum.photos/id/30/800/600', title: 'Golden Hour' },
  { id: 5, url: 'https://picsum.photos/id/42/800/600', title: 'City Lights' },
  { id: 6, url: 'https://picsum.photos/id/48/800/600', title: 'Island Peak' },
  { id: 7, url: 'https://picsum.photos/id/54/800/600', title: 'Desert Sands' },
  { id: 8, url: 'https://picsum.photos/id/60/800/600', title: 'Desktop Setup' },
  { id: 9, url: 'https://picsum.photos/id/75/800/600', title: 'Vintage Vibes' },
  { id: 10, url: 'https://picsum.photos/id/82/800/600', title: 'Ocean Blue' },
];

const Media = () => {
  const [visibleCount, setVisibleCount] = useState(4); // Start with 4 images

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 3); // Load 3 more at a time
  };

  return (
    <div className="container">
      <Header />

      <div className="grid">
        {IMAGES.slice(0, visibleCount).map((img, index) => (
          <div className="card" key={img.id} style={{ '--i': index }}>
            <img src={img.url} alt={img.title} />
            <div className="overlay">
              <span>{img.title}</span>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < IMAGES.length && (
        <div className="button-container">
          <button className="load-more" onClick={loadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Media;