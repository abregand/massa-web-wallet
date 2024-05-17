import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Home from './pages/Home';
import Wallets from './pages/Wallets';

const App: React.FC = () => {
  return (
    <div>
      <div className="bg-danger p-1 text-center">Network: BuildNet</div>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <a className="navbar-brand" href="/">Massa Web Wallet</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item ms-2">
                <a href="/" className="nav-link">Home</a>
              </li>
              <li className="nav-item ms-2">
                <a href="/wallets" className="nav-link">Wallets</a>
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
          <div><span>© Copyright 2024 | <a href="https://web-wallet.massa.ga/">Massa Web Wallet</a></span></div>
          <div className="small">♥ Donate <code>AU1L3YbT7SBwxdVwzacoonEgou5oXi5mNfXMaXqYhoL69GVrDUrE</code></div>
        </div>
      </footer>
    </div>
  );
}

export default App;
