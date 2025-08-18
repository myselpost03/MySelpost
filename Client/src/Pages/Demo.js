import React, { useState, useRef } from "react";
import "../Styles/Demo.css";

const cardsData = [
  { id: 1, name: "Cat 1", color: "lightcoral" },
  { id: 2, name: "Cat 2", color: "lightblue" },
  { id: 3, name: "Cat 3", color: "lightgreen" },
  { id: 4, name: "Cat 4", color: "lightpink" },
];

export default function Demo() {
  const [cards, setCards] = useState(cardsData);
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0, time: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const startDrag = (x, y) => {
    setDragging(true);
    setStartPos({ x, y, time: Date.now() });
  };

  const moveDrag = (x, y) => {
    if (!dragging) return;
    setCurrentPos({ x: x - startPos.x, y: y - startPos.y });
  };

  const endDrag = () => {
    if (!dragging) return;

    const dx = currentPos.x;
    const dt = Date.now() - startPos.time;
    const velocityX = dx / dt * 10; // scale factor for velocity

    const threshold = 120; // minimum distance
    const velocityThreshold = 0.5; // soft swipe speed

    if (dx > threshold || velocityX > velocityThreshold) swipeCard("right");
    else if (dx < -threshold || velocityX < -velocityThreshold) swipeCard("left");
    else setCurrentPos({ x: 0, y: 0 });

    setDragging(false);
  };

  const swipeCard = (direction) => {
    setCards((prev) => prev.slice(1));
    setCurrentPos({ x: 0, y: 0 });
    console.log("Swiped", direction);
  };

  // Mouse Events
  const handleMouseDown = (e) => startDrag(e.clientX, e.clientY);
  const handleMouseMove = (e) => moveDrag(e.clientX, e.clientY);
  const handleMouseUp = () => endDrag();

  // Touch Events
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  };
  const handleTouchEnd = () => endDrag();

  return (
    <div
      className="card-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {cards
        .slice(0)
        .reverse()
        .map((card, index) => {
          const isTop = index === cards.length - 1;
          return (
            <div
              key={card.id}
              ref={isTop ? cardRef : null}
              className="card"
              style={{
                backgroundColor: card.color,
                zIndex: index,
                transform: isTop
                  ? `translate(${currentPos.x}px, ${currentPos.y}px) rotate(${
                      currentPos.x / 10
                    }deg)`
                  : "scale(0.95)",
              }}
              onMouseDown={isTop ? handleMouseDown : null}
              onTouchStart={isTop ? handleTouchStart : null}
            >
              {card.name}
            </div>
          );
        })}
      {cards.length === 0 && <div className="no-cards">No more cards!</div>}
    </div>
  );
}