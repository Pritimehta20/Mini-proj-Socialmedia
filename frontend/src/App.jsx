import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css'
import Register from './Pages/register.jsx';
import Login from './Pages/login.jsx';
import Dashboard from './Pages/Dashboard.jsx';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>

        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
