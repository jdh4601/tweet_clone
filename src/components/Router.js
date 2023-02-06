import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from '../routes/Home';
import Auth from '../routes/Auth';
import Navigation from './Navigation';
import Profile from '../routes/Profile';

const Router = ({ isLoggedIn, userObj, refreshUser }) => {
  return (
    <HashRouter>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route exact path="/" element={<Home userObj={userObj} />} />
            <Route
              exact
              path="/profile"
              element={<Profile userObj={userObj} refreshUser={refreshUser} />}
            />
          </>
        ) : (
          <>
            <Route exact path="/" element={<Auth />} />
          </>
        )}
      </Routes>
    </HashRouter>
  );
};

export default Router;
