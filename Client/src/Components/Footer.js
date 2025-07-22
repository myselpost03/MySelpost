import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-txt-1">MySelpost</h3>
          <p className="tagline">"Ideas don’t need code. Just a sketch."</p>
          <p>
            Your place to turn sketches or prompts into real websites & apps.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact Us</Link>
            </li>
            <li>
              <Link to="/pricing">Pricing</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Get in Touch</h4>
          <p>Email: myselpost03@gmail.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MySelpost. All rights reserved.</p>
        <div style={{ marginTop: "10px" }}>
          <a
            href="https://game-sprunki.com/"
            target="_blank"
            rel="noopener noreferrer"
            title="Game Sprunki"
            style={{ color: "#fff", textDecoration: "underline" }}
          >
            Game Sprunki
          </a>
        </div>
        <div style={{ marginTop: "10px" }}>
          <a
            href="https://kontext-ai.com/"
            style={{ color: "#fff", textDecoration: "underline" }}
          >
            Kontext AI
          </a>
        </div>

        <div style={{ marginTop: "10px" }}>
          <a
            href="https://submitaitools.org/"
            style={{ color: "#fff", textDecoration: "underline" }}
          >
            Submit AI Tools
          </a>
        </div>
        <div style={{ marginTop: "10px" }}>
          <a
            href="https://yo.directory/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#fff", textDecoration: "underline" }}
          >
            <img
              src="https://cdn.prod.website-files.com/65c1546fa73ea974db789e3d/65e1e171f89ebfa7bd0129ac_yodirectory-featured.png"
              alt="yo.directory"
              style={{ width: "150px", height: "54px" }}
              width="150"
              height="54"
            />
          </a>
        </div>
         <a
          href="https://twelve.tools"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://twelve.tools/badge0-white.svg"
            alt="Featured on Twelve Tools"
            width="200"
            height="54"
            style={{ marginTop: "10px" }}
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
