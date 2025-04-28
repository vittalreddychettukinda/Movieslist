import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export function Profile() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const handleSubcription = (Amount, planType) => {
    navigate("/payment", { state: { payment: Amount, planType } });
  };

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:3000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data); // User data including favorites
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
        });
    }
  }, [token]);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div style={styles.wrapper}>
      {/* Left: Profile Info */}
      <div style={styles.container}>
        <div style={styles.avatar}>
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div style={styles.info}>
          <h2 style={{ marginTop: 10 }}>Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>

      {/* Right: Subscription & Favorites */}
      <div style={styles.rightPanel}>
        {user.subscription && user.subscription.paymentId ? (
          <>
            <h3>Subscription Details</h3>
            <p><strong>Plan Type:</strong> {user.subscription.paymentId.planType}</p>
            <p><strong>Amount:</strong> ₹{user.subscription.paymentId.amount}</p>
            <p><strong>Paid At:</strong> {new Date(user.subscription.paymentId.paidAt).toLocaleDateString()}</p>
          </>
        ) : (
          <>
            <h3>Subscriptions</h3>
            <div style={styles.plan}>
              <p><strong>Monthly:</strong> ₹199/month - Basic access to all movies.</p>
              <button style={styles.button} onClick={() => handleSubcription(199, "1-month")}>Subscribe Monthly</button>
            </div>
            <div style={styles.plan}>
              <p><strong>Quarterly:</strong> ₹499/3 months - Save 15% with quarterly plan.</p>
              <button style={styles.button} onClick={() => handleSubcription(499, "3-month")}>Subscribe Quarterly</button>
            </div>
            <div style={styles.plan}>
              <p><strong>Yearly:</strong> ₹1799/year - Best value with full access.</p>
              <button style={styles.button} onClick={() => handleSubcription(1799, "12-month")}>Subscribe Yearly</button>
            </div>
          </>
        )}

        <h3 style={{ marginTop: 30 }}>Favourite Movies</h3>
        <ul>
          {user.favorites && user.favorites.length > 0 ? (
            user.favorites.map((movie, index) => (
              <li key={index}>{movie.title}</li>
            ))
          ) : (
            <li>No favorite movies added yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

// Styles
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 40,
    padding: 40,
    flexWrap: "wrap",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    maxWidth: 400,
    marginTop: 40,
    border: "1px solid #ccc",
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#f9f9f9",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    backgroundColor: "#4A90E2",
    color: "#fff",
    fontSize: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  info: {
    textAlign: "center",
  },
  rightPanel: {
    padding: 20,
    maxWidth: 350,
    marginTop: 40,
    border: "1px solid #ccc",
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  plan: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4A90E2",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
};
