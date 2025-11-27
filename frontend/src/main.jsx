import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Import your existing App.jsx
import './App.css'; // Import your App.css if it exists
import 'bootstrap/dist/css/bootstrap.min.css'; // Add this line

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
