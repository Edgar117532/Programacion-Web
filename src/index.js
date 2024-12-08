import React from 'react';
import ReactDOM from 'react-dom/client'; // Cambio en React 18
import App from './App';
import './index.css';

// Crear el root y renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root')); // Crear el root en lugar de renderizar directamente
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
