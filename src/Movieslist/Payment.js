import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiUrl } from "./Configuration.js/Auth";
import axios from "axios";
export function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { payment, planType } = location.state || {};
  const [cardDetails, setCardDetails] = useState({
    cardnumber: "",
    expiredate: "",
    cvv: "",
    amount: payment || "",
    planType: planType || "1-month",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    const { cardnumber, expiredate, cvv, amount } = cardDetails;

    if (cardnumber.length !== 16) {
      alert("Card number must be 16 digits.");
      return;
    }

    if (expiredate.length !== 5 || !expiredate.includes("/")) {
      alert("Expiry date should be in MM/YY format.");
      return;
    }
    if (cvv.length !== 3) {
      alert("CVV must be 3 digits.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Invalid payment amount.");
      return;
    }

    try {
      const res = await axios.post(
        `${ApiUrl}/payment`,
        { cardnumber, expiredate, cvv, amount, planType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`Payment of ₹${cardDetails.amount} done successfully!`);
      navigate("/profile");
      console.log("Payment Details Submitted:", res.data);
    } catch (error) {
      console.error("Payment failed", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Enter Payment Details</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="cardnumber"
          placeholder="Card Number"
          value={cardDetails.cardnumber}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="expiredate"
          placeholder="MM/YY"
          value={cardDetails.expiredate}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="cvv"
          placeholder="CVV"
          value={cardDetails.cvv}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={cardDetails.amount}
          onChange={handleChange}
          disabled={true}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="planType"
          value={cardDetails.planType}
          onChange={handleChange}
          disabled={true}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Pay Now</button>
      </form>
    </div>
  );
}

// Styles
const styles = {
  container: {
    maxWidth: "400px",
    marginTop: 100,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    marginTop: 20,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    border: "1px solid #aaa",
  },
  button: {
    backgroundColor: "#4A90E2",
    color: "#fff",
    padding: 12,
    border: "none",
    borderRadius: 5,
    fontSize: 16,
    cursor: "pointer",
  },
  // Responsive Styles
  "@media (max-width: 600px)": {
    container: {
      maxWidth: "90%",
      marginLeft: "5%",
      marginRight: "5%",
    },
    form: {
      gap: 10,
    },
    input: {
      fontSize: 14,
    },
    button: {
      padding: 10,
      fontSize: 14,
    },
  },
};
