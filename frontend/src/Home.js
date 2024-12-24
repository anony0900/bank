import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to NASA Bank</h1>
      <h2>Your Trusted Banking Partner</h2>
      <div className="button-container">
        <button className="action-button" onClick={() => navigate("/signup")}>
          Open Account
        </button>
        <button
          className="action-button"
          onClick={() => navigate("/view-account")}
        >
          View Account
        </button>
      </div>
    </div>
  );
}

export default Home;
