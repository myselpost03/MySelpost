import React from 'react';
import '../Styles/GameOver.css';

const GameOver = ({ score, onRestart }) => {
  return (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <h1 className="glitch-text" data-text="GAME OVER">
          GAME OVER
        </h1>
        
        <div className="stats-container">
          <p className="final-score">FINAL SCORE: <span>{score}</span></p>
        </div>

        <button className="restart-button" onClick={onRestart}>
          TRY AGAIN
        </button>
      </div>
    </div>
  );
};

export default GameOver;