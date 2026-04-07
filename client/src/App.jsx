import { Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import ItemDetail from './ItemDetail';
import EditItem from './EditItem.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import MainLayout from './MainLayout.jsx';
import Profile from './Profile.jsx';
import Cart from './Cart.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/edit-item/:id" element={<EditItem />} />
      </Route>
    </Routes>
  );
}

export default App;