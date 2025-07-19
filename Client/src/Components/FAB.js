import React from 'react';
import '../Styles/FAB.css';
import { FaCommentDots } from 'react-icons/fa';

const FAB = ({ onClick }) => {
  return (
    <div className="sketchy-fab" onClick={onClick} title="Open Chat">
      <FaCommentDots className="fab-icon" />
    </div>
  );
};

export default FAB;
