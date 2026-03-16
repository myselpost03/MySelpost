import React, {useState} from 'react';
import '../Styles/Demo.css';
import myBackgroundImage from '../Assets/bg.png';
import fact from '../Assets/group.jpg';

const Demo = () => {
    const [liked, setLiked] = useState(false);

  return (
    <div className="bg-fact">
      <img
        src={myBackgroundImage}
        alt="background"
        className="background-image"
      />

      {/* Image Card */}
      <div className="fact-image-card">
        <img
          src={fact}
          className="fact-image"
          alt="fact visual"
          style={{ height: '220px' }}
        />
         <div className="like-overlay">
          <button
            className={`like-btn ${liked ? "liked" : ""}`}
            onClick={() => setLiked(!liked)}
          >
            {liked ? "❤️" : "🤍"}
          </button>
          <span className="like-count">1.2K</span>
        </div>
      </div>

      {/* Fact Card */}
      {/* Fact Card */}
      <div className="fact-card">
        {/* red pin */}
        <div className="pin"></div>

        {/* title */}
        <h2 className="fact-title">Fact</h2>
    
        {/* notebook text area */}
        <p className="fact-text">
          Welcome to factpins. There was a man who didn't study and got jailed
          for 3 years. His parents filed a complaint against school. Then he
          left his chool.
        </p>
        
       <div className="button-row">
        <button className="nav-btn">Notify Me</button>
        <button className="nav-btn">🪙 Coins</button>
        <button className="nav-btn">Next</button>
         
        </div>
      </div>

    
    </div>
  );
};

export default Demo;
