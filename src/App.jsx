import { NavLink, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import usePreferencesStore from './store/preferencesStore.js';
import { applyTheme } from './utils/theme.js';

function App() {
  const theme = usePreferencesStore((state) => state.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="app-shell" role="application">
      <header className="app-header">
        <h1>Chubb React Takehome Assessment</h1>
        <nav aria-label="Main navigation">
          <ul className="nav-list">
            <li>
              <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                About
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
