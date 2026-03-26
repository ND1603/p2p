import React, { useState } from 'react';
import api from './api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await api.post('/login', { username: user, password: pass });
      
      login(res.data.username, res.data.token);
      navigate('/'); 
    } catch (err) {
      setErrorMsg("Invalid username or password.");
    }
  };

  return (
  <div className="auth-page">
    <div className="auth-card">
      <h2>Welcome Back</h2>
      {errorMsg && <p className="status-msg error">{errorMsg}</p>}
      <form className="auth-form" onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Username" 
          onChange={(e) => setUser(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPass(e.target.value)} 
          required 
        />
        <button type="submit" className="auth-button">Sign In</button>
      </form>
      <p className="auth-toggle-text">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  </div>
);
}

export default Login;