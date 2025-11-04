import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import '../Styles/SendGiftPopup.css';

// Real gift images
const gifts = [
  { id: 1, name: 'Bouquet', src: 'https://images.icon-icons.com/1478/PNG/96/bouquet_101953.png' },
  { id: 2, name: 'Ruby', src: 'https://cdn1.iconfinder.com/data/icons/DarkGlass_Reworked/128x128/apps/beryl-manager.png' },
  { id: 3, name: 'Car', src: 'https://cdn1.iconfinder.com/data/icons/icons-for-a-site-1/64/advantage_deliver-64.png' },
  { id: 4, name: 'Chocolate', src: 'https://cdn0.iconfinder.com/data/icons/icecandy-psd/256/icecandy-chocolate.png' },
  { id: 5, name: 'Trophy', src: 'https://cdn1.iconfinder.com/data/icons/icons-for-a-site-1/64/advantage_quality-64.png' },
  { id: 6, name: 'Clown', src: 'https://images.icon-icons.com/327/PNG/256/Clown_Impish_35102.png' },
];

const SendGiftPopup = ({ onClose }) => {
  const [bottom, setBottom] = useState(-300); // offscreen
  const popupHeight = 250;
  const speed = 5;

  // Animate popup up
  useEffect(() => {
    let animationFrame;

    const animateUp = () => {
      setBottom(prev => {
        if (prev >= 20) return 20;
        animationFrame = requestAnimationFrame(animateUp);
        return prev + speed;
      });
    };

    animationFrame = requestAnimationFrame(animateUp);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleSendGift = (gift) => {
    toast.success(`Gift Sent: ${gift.name}`);
    let animationFrame;
    const animateDown = () => {
      setBottom(prev => {
        if (prev <= -popupHeight) {
          onClose();
          return -popupHeight;
        }
        animationFrame = requestAnimationFrame(animateDown);
        return prev - speed;
      });
    };
    animationFrame = requestAnimationFrame(animateDown);
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="gift-popup" style={{ bottom: `${bottom}px` }}>
        <h3>Send a Gift</h3>
        <div className="gift-list">
          {gifts.map(gift => (
            <div
              key={gift.id}
              className="gift-item"
              onClick={() => handleSendGift(gift)}
            >
              <img src={gift.src} alt={gift.name} />
              <span>{gift.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SendGiftPopup;
