// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import SignupForm from "./SignupForm";
import "./App.css";
import ViewAccount from "./ViewAccount";
import SuccessPage from "./SuccessPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/view-account" element={<ViewAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
