import { Routes, Route, NavLink } from 'react-router-dom';
import { Package, Home as HomeIcon, LayoutDashboard, BarChart3 } from 'lucide-react';
import Home from './pages/Home';
import Products from './pages/Products';
import Stats from './pages/Stats';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <NavLink to="/" className="nav-brand">
          <Package className="icon" size={24} />
          <span>ProductDash</span>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <HomeIcon size={18} /> Home
          </NavLink>
          <NavLink to="/products" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Products
          </NavLink>
          <NavLink to="/stats" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <BarChart3 size={18} /> Stats
          </NavLink>
        </div>
      </nav>

      <main className="main-content animate-fade-in">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
