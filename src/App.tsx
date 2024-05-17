import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Wallets from './pages/Wallets';

const App: React.FC = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <a className="navbar-brand" href="/">Massa Web Wallet</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a href="/">Home</a>
              </li>
              <li className="nav-item ms-2">
                <a href="/wallets">Wallets</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wallets" element={<Wallets />} />
          </Routes>
        </Router>
      </div>

      <footer className="footer">
        <div className="container">
          <span>© Copyright 2024 | <a href="https://web-wallet.massa.ga/">Massa Web Wallet</a></span>
        </div>
      </footer>
    </div>
  );
}

export default App;
