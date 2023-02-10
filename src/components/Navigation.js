import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
import { BsChatQuoteFill } from 'react-icons/bs';

function Navigation({ userObj }) {
  return (
    <nav>
      <ul className="nav-container">
        <li className="logo-box">
          <BsChatQuoteFill size={28} color={'blue'} />
          <Link to="/">
            <h1 className="home">Home</h1>
          </Link>
        </li>
        <li className="profile">
          <Link to="/profile">{userObj.displayName}의 프로필</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
