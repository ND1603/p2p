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
    <div className="auth-container">
      <h2>Create Account</h2>
      {message.text && (
        <p style={{ color: message.type === 'error' ? 'red' : 'green', textAlign: 'center', margin: '10px 0' }}>
          {message.text}
        </p>
      )}
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Choose Username" onChange={(e) => setUser(e.target.value)} required />
        <input type="password" placeholder="Choose Password" onChange={(e) => setPass(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
}

export default Register;