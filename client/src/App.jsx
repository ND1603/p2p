import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home.jsx';
import ItemDetail from './ItemDetail';
import Login from './Login.jsx';
import Register from './Register.jsx';
import { useAuth } from './AuthContext';
import './App.css';

function App() {
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
              <Link to="/login" style={{ color: '#2563eb' }}>Login</Link>
              <Link to="/register" style={{ color: '#2563eb' }}>Register</Link>
            </>
          ) : (
            <div className="user-greeting">
              <span>Hi, <strong>{username}</strong></span>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/item/:id" element={<ItemDetail />} />
      </Routes>
    </div>
  );
}

export default App;