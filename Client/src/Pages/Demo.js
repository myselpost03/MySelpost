import React, { useState } from "react";
import TermsPopup from "../Components/TermsPopup";

export default function Demo() {
  const [showTerms, setShowTerms] = useState(true);

  return (
    <div>
      {showTerms && <TermsPopup onDone={() => setShowTerms(false)} />}
      {!showTerms && <div className="chat-ui">💬 Chat Interface Here</div>}
    </div>
  );
}

