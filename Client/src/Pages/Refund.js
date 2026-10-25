import React, { useState, useRef } from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../Components/Header';
import SketchyHeader from "../Components/SketchyHeader";
import toast, { Toaster } from 'react-hot-toast';
import '../Styles/Refund.css';

const Refund = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const formRef = useRef(null);
const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVerifying(true); // Change label to "Verifying..."

    // Wait 5 seconds before showing the success message
    setTimeout(() => {
      toast.success("Request Verified! Your payment will be refunded within 3 days.", {
        duration: 5000,
        style: { background: '#333', color: '#fff' },
      });
      
      setIsVerifying(false); // Reset label
      if (formRef.current) formRef.current.reset(); // Clear the form
    }, 5000);
  };

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <>
            <SketchyHeader title='Refund' onBack={handleBack} />
      
      <div className="refund-page-container">
        <div className="refund-card">
          <h2>Refund Request</h2>
          <p className="refund-text">
            Transactions are verified manually. Please provide exact details for your refund request.
          </p>
          
          <form className="refund-form" ref={formRef} onSubmit={handleSubmit}>
            <input type="text" placeholder="Your UPI Transaction ID (UTR)" required />
            <input type="number" placeholder="Payment Amount (₹)" required />
            <select className="refund-input" required>
              <option value="">Reason for Refund</option>
              <option value="double_payment">Double Payment</option>
              <option value="service_not_working">Service Not Working</option>
              <option value="other">Other</option>
            </select>
            <textarea placeholder="Additional notes or error details..." rows="3"></textarea>
            
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying Request..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default Refund;