import React, { useState } from 'react';
import api from './api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      await api.post('/register', { username: user, password: pass });
      setMessage({ text: "Account created! Redirecting to login...", type: 'success' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage({ text: "Registration failed. Username might be taken.", type: 'error' });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        {message.text && (
          <p className={`status-msg ${message.type}`}>
            {message.text}
          </p>
        )}
        <form className="auth-form" onSubmit={handleRegister}>
          <input type="text" placeholder="Choose Username" onChange={(e) => setUser(e.target.value)} required />
          <input type="password" placeholder="Choose Password" onChange={(e) => setPass(e.target.value)} required />
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <p className="auth-toggle-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;