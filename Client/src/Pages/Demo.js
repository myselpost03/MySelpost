import React from "react";

const Demo = () => {
  const handleBuyNow = () => {
    const checkoutUrl = "https://test.checkout.dodopayments.com/buy/pdt_hGntim2Yociijw5zJEWo2?quantity=1";

    // Open Dodo checkout in a new popup window
    const popup = window.open(
      checkoutUrl,
      "DodoCheckout",
      "width=600,height=700"
    );

    if (!popup) {
      alert("Popup blocked! Please allow popups for this site.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Buy 100 Coins for $1</h2>
      <button onClick={handleBuyNow} style={styles.button}>
        Purchase Now
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "60px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Demo;
