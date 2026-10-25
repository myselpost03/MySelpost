import React, { useState } from 'react';
import Header from '../Components/Header';
import '../Styles/FAQ.css';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      category: 'general',
      question: 'What is MySelpost and how does it work?',
      answer:
        'MySelpost allows users to request profile access and media analysis using our automated node architecture. You can enter a target handle to fetch profile data, either via instant VIP processing or standard queue access.'
    },
    {
      category: 'general',
      question: 'Why is there an estimated wait time for standard access?',
      answer:
        'Due to high server traffic and API rate limits, standard requests are placed in an automated cluster queue. VIP fast-pass options allow users to bypass the line instantly.'
    },
    {
      category: 'unlock',
      question: 'How does the "Unlock in 10 Days" free plan work?',
      answer:
        'Selecting the 10-Day Free Plan allows you to earn full profile access by completing 5 quick daily tasks over 10 consecutive days without paying any upfront fee.'
    },
    {
      category: 'unlock',
      question: 'What happens if I miss a day during the 10-day task plan?',
      answer:
        'To maintain active status, tasks must be completed daily. Missing a day resets your streak counter to Day 1, requiring you to restart the 10-day cycle.'
    },
    {
      category: 'vip',
      question: 'What benefits come with VIP Instant Access?',
      answer:
        'VIP access instantly skips the server wait queue, granting immediate access to profile data and media metadata decryption without completing daily tasks.'
    },
    
    {
      category: 'security',
      question: 'Are my payment and personal details secure?',
      answer:
        'Absolutely. All payments and data transfers are protected using industry-standard 256-bit SSL encryption. We do not store raw card numbers or sensitive credentials.'
    }
  ];

  const categories = [
    { key: 'all', label: 'All Questions' },
    { key: 'general', label: 'General' },
    { key: 'unlock', label: 'Free Unlock' },
    { key: 'vip', label: 'VIP Pass' },
    { key: 'security', label: 'Privacy & Safety' }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Header />
      <div className="faq-page-wrapper">
        <div className="faq-container">
          
          {/* Header Section */}
          <div className="faq-header">
            <span className="faq-badge">SUPPORT CENTER</span>
            <h1 className="faq-title">Frequently Asked Questions</h1>
            <p className="faq-subtitle">
              Have questions about queue times, profile unlocks, or VIP access? Find quick answers below.
            </p>
          </div>

          {/* Search Bar */}
          <div className="faq-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="faq-search-input"
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="faq-categories">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`category-tab ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setOpenIndex(null);
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="faq-list">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                    <button
                      className="faq-question-btn"
                      onClick={() => toggleAccordion(index)}
                    >
                      <span>{faq.question}</span>
                      <span className="faq-icon-indicator">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer-content">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="faq-empty">
                <p>No answers found matching "{searchTerm}". Try another term.</p>
              </div>
            )}
          </div>

          {/* Contact Support Footer */}
          <div className="faq-footer-card">
            <h3>Still need help?</h3>
            <p>Can’t find the answer you are looking for? Our live server monitors are active 24/7.</p>
            <div className="faq-footer-status">
              <span className="status-dot"></span>
              <span>Server Network: <b>Operational</b></span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default FAQ;