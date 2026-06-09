import { NavLink, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import Dashboard from './pages/Dashboard';
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
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
