import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function MainLayout() {
  const { username, logout } = useAuth();

  return (
    <div className="container">
      <header className="header">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 className="title">p2p</h1>
        </Link>

        <nav className="nav-bar">
          {!username ? (
            <>
              <Link to="/login" style={{ color: '#2563eb', fontWeight: '500' }}>Login</Link>
              <Link to="/register" style={{ color: '#2563eb', fontWeight: '500' }}>Register</Link>
            </>
          ) : (
            <div className="user-greeting">
              <span>Hi, <strong>{username}</strong></span>
              <button onClick={logout} className="btn-delete" style={{ backgroundColor: '#e5e7eb', color: '#374151', marginLeft: '10px' }}>Logout</button>
            </div>
          )}
        </nav>
      </header>

      <main>
        {/* Child routes like Home.jsx and ItemDetail.jsx render here */}
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
