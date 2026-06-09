import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { applyTheme } from './utils/theme.js';
import './styles/global.scss';

// Apply persisted theme before rendering React app
try {
  const raw = localStorage.getItem('chubb-preferences');
  if (raw) {
    const parsed = JSON.parse(raw);
    const theme = parsed?.state?.theme ?? parsed?.theme;
    if (theme) {
      applyTheme(theme);
    }
  }
} catch {
  // fallback to default theme if storage read fails
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
