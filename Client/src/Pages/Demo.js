import React from 'react';
// Move styles to a CSS file for better mobile performance
import '../Styles/Demo.css'; 

 const Demo = () => {
  const bots = [
    { id: 1, name: "BotFather", username: "botfather", avatar: "https://i.pravatar.cc/100?u=1" },
    { id: 2, name: "Music Downloader", username: "music_bot", avatar: "https://i.pravatar.cc/100?u=2" },
    { id: 3, name: "Currency Converter", username: "exchanger_bot", avatar: "https://i.pravatar.cc/100?u=3" },
  ];

  return (
    <div className="bot-page">
      <header className="navbar">
        <span className="logo">MySelpost</span>
      </header>

      <main className="container">
        <div className="hero">
          <h1>Telegram Bot Directory</h1>
          <p>Discover powerful tools for your Telegram experience.</p>
        </div>

        <div className="bot-grid">
          {bots.map(bot => (
            <div key={bot.id} className="bot-card">
              <div className="bot-profile">
                <img src={bot.avatar} alt={bot.name} className="bot-avatar" />
                <div className="bot-info">
                  <h3>{bot.name}</h3>
                  <span className="bot-handle">@{bot.username}</span>
                </div>
              </div>
              <button className="launch-btn" onClick={() => window.open(`https://t.me/${bot.username}`)}>
                Launch Bot
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};export default Demo;