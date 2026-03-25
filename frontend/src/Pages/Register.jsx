import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Register.css';

const  Register=()=> {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        form
      );

      alert("Registration successful ✅");

      // redirect to login
      navigate("/");

    } catch (err) {
        console.log(err);
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <div className="register-container">
    <div className="register-card">

      <div className="register-header">
        <h1>ChatSphere</h1>
        <p>Register to continue</p>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>

        <div className="input-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="login-link">
        Already have an account?{" "}
        <span onClick={() => navigate("/")}>
          Login
        </span>
      </div>

    </div>
  </div>
  </>
  );
}

export default Register;