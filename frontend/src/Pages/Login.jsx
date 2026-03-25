import React from 'react'
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {
     const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        form
      );

      // Save JWT token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", res.data.name);
      name: res.data.name,

      alert("Login successful ✅");

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="login-container">
    <div className="login-card">

      {/* 🔹 Header */}
      <div className="login-header">
        <h1>Welcome Back</h1>
        <p>Login to your account</p>
      </div>

      {/* 🔹 Form */}
      <form className="login-form" onSubmit={handleSubmit}>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* 🔹 Footer */}
      <div className="register-link">
        Don’t have an account?{" "}
        <span onClick={() => navigate("/register")}>
          Register
        </span>
      </div>

    </div>
  </div>
    </>
  )
}
export default Login