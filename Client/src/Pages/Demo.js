import React from 'react';
import '../Styles/Demo.css';

const Demo = () => {
  const totalStars = 100;
  const stars = Array.from({ length: totalStars }, (_, i) => {
    const style = {
      top: `${Math.random() * 100}vh`,
      left: `${Math.random() * 100}vw`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    };
    return <div key={i} className="star" style={style}></div>;
  });

  return (
    <div className="sky">
      {stars}
      <div className="founder-wrapper">
        <div className="founder-container">
          <img
            src="https://i.pinimg.com/1200x/71/ec/bd/71ecbd87caa03b987fa73f99854a6160.jpg"
            alt="Founder"
            className="founder-image"
          />
          <div className="founder-description">
            <p>
              <b><i>
                Elon Musk is a visionary entrepreneur known for revolutionizing the tech and space industries. 
                His leadership and bold thinking continue to inspire millions.
              </i></b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
