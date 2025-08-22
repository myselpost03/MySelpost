import React from "react";
import { useNavigate } from "react-router-dom";
import SketchyHeader from "../Components/SketchyHeader";
import "../Styles/Privacy.css"; // Reuse same CSS for consistency

const About = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <SketchyHeader title="About Us" onBack={handleBack} />
      <div className="privacy-container">
  <div className="privacy-card">
    <h1 className="privacy-title">About Our Platform</h1>

    <p className="privacy-text">
      Welcome to our platform! We are proud to bring you a unique digital experience 
      that combines <strong>social networking</strong> with a powerful 
      <strong> sketch-to-app builder tool</strong>. Our goal is to create an environment 
      where people from all over the world can connect, communicate, and collaborate, 
      while also giving creators, developers, and innovators the tools they need to 
      turn their ideas into reality.  
    </p>

    <p className="privacy-text">
      On <strong>desktop devices</strong>, our service transforms into a creative workspace 
      where you can upload sketches, provide text-based inputs, and instantly generate 
      app wireframes or mockups. This is designed for aspiring developers, students, 
      and professionals who want a quick and intuitive way to visualize their concepts.  
      On <strong>mobile devices</strong>, our platform becomes a vibrant social community 
      that allows you to interact with people worldwide, share your thoughts, exchange photos, 
      and engage in meaningful discussions.  
    </p>

    <h2 className="privacy-subtitle">Our Mission</h2>
    <p className="privacy-text">
      Our mission is to create a platform that brings value to both everyday users 
      and creative minds. For social users, our mission is to provide a safe, engaging, 
      and entertaining community where people can express themselves freely and 
      build lasting connections. For creators, our mission is to provide innovative 
      tools like the sketch-to-app builder that simplify the process of designing 
      and prototyping applications without needing advanced technical knowledge.  
    </p>

    <p className="privacy-text">
      We believe that technology should empower people. Whether it’s a teenager 
      looking for a space to connect with friends, a hobbyist designer sketching 
      out their first app idea, or an entrepreneur trying to validate a product concept, 
      our platform is here to make that journey simple, fun, and impactful.  
    </p>

    <h2 className="privacy-subtitle">What We Offer</h2>
    <ul className="privacy-list">
      <li>
        <strong>Social Networking Features:</strong> Share posts, photos, comments, and messages 
        to stay connected with your network. We provide tools for safe interactions and 
        community engagement.  
      </li>
      <li>
        <strong>Community Engagement:</strong> Discover and connect with like-minded people 
        across the globe, participate in discussions, and enjoy a space that values 
        creativity and respect.  
      </li>
      <li>
        <strong>Sketch-to-App Builder Tool:</strong> Easily convert your sketches and text 
        descriptions into app layouts, wireframes, or prototypes. This feature empowers 
        both technical and non-technical users to bring their ideas to life.  
      </li>
      <li>
        <strong>Creative Empowerment:</strong> Developers, designers, and even students 
        can quickly turn rough ideas into structured mockups, helping them save time 
        and resources.  
      </li>
      <li>
        <strong>Privacy and Control:</strong> We prioritize your privacy and allow you 
        to manage your data, account preferences, and content visibility at all times.  
      </li>
    </ul>

    <h2 className="privacy-subtitle">Our Values</h2>
    <p className="privacy-text">
      At the heart of our platform are three key values: 
      <strong> creativity, connection, and trust</strong>.  
    </p>

    <p className="privacy-text">
      For creators, our sketch-to-app tool represents <strong>creativity</strong>—a chance 
      to explore new ideas, test product concepts, and learn the basics of app design 
      without needing complex software.  
      For social users, our platform represents <strong>connection</strong>—a place where 
      friendships, communities, and conversations thrive.  
      And for everyone, we emphasize <strong>trust</strong>—ensuring transparency, 
      user safety, and data privacy.  
    </p>

    <h2 className="privacy-subtitle">Why Choose Us?</h2>
    <p className="privacy-text">
      There are many social platforms and design tools available today, but very few 
      bring these two worlds together. By merging social networking with a sketch-to-app 
      builder, we provide a truly unique experience. You don’t have to switch between 
      different apps for creativity and community—our platform offers both in one place.  
    </p>

    <p className="privacy-text">
      Whether you are here to socialize and share your life moments, or to create 
      the next big app idea, our platform supports your journey every step of the way.  
      We’re constantly improving our features, listening to feedback, and ensuring 
      that our users feel valued and empowered.  
    </p>

    <h2 className="privacy-subtitle">Contact Us</h2>
    <p className="privacy-text">
      Have questions, suggestions, or collaboration ideas?  
      We would love to hear from you! You can reach us anytime at 
      <strong> myselpost03@gmail.com</strong>.  
    </p>
    <p className="privacy-text">
      Our team is committed to providing quick responses and maintaining open communication 
      with our users. Whether it’s a technical issue, a privacy concern, or simply an idea 
      to improve the platform, your input is always welcome.  
    </p>
  </div>
</div>

    </>
  );
};

export default About;
