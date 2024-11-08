// Header.js
import React from 'react';
import './Header.css';

function Header({ userName }) {
  return (
    <header className="header">
      <h1>Welcome, {userName}</h1>
    </header>
  );
}

export default Header;