import React, { useEffect, useState } from "react";
import "../Styles/Demo.css";

const Demo = () => {
  const [boyPosition, setBoyPosition] = useState(1); // 1: middle, 0: top, 2: bottom
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWin, setGameWin] = useState(false);

  const lanes = [0, 1, 2];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") setBoyPosition((prev) => Math.max(prev - 1, 0));
      if (e.key === "ArrowDown") setBoyPosition((prev) => Math.min(prev + 1, 2));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver || gameWin) return;

    const interval = setInterval(() => {
      const newObs = obstacles.map((obs) => ({
        ...obs,
        x: obs.x - 1,
      })).filter((obs) => obs.x > 0);

      if (Math.random() < 0.3) {
        newObs.push({ lane: lanes[Math.floor(Math.random() * 3)], x: 10 });
      }

      const caught = newObs.some((obs) => obs.x === 1 && obs.lane === boyPosition);
      if (caught) {
        setGameOver(true);
        return;
      }

      setScore((prev) => prev + 1);
      if (score >= 30) setGameWin(true); // Reached girl

      setObstacles(newObs);
    }, 300);

    return () => clearInterval(interval);
  }, [obstacles, boyPosition, gameOver, score, gameWin]);

  const resetGame = () => {
    setBoyPosition(1);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setGameWin(false);
  };

  return (
    <div className="game-container">
      <h2>💘 Chase to Chat</h2>
      <div className="road">
        {[0, 1, 2].map((lane) => (
          <div key={lane} className="lane">
            {obstacles
              .filter((obs) => obs.lane === lane)
              .map((obs, i) => (
                <div key={i} className="obstacle" style={{ left: `${obs.x * 10}%` }} />
              ))}
            {boyPosition === lane && <div className="boy">👦</div>}
            {lane === 1 && <div className="girl">👧</div>}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="overlay">
          <h3>You hit an obstacle! 💔</h3>
          <button onClick={resetGame}>Try Again</button>
        </div>
      )}
      {gameWin && (
        <div className="overlay">
          <h3>You reached her! 🥰</h3>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default Demo;
