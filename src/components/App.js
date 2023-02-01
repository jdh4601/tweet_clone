import React, { useState, useEffect } from 'react';
import Router from './Router';
import { authService } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  // 초기화 시켜줌
  const [init, setInit] = useState(false);
  // 로그인 상태 여부
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    // 로그인 상태 확인
    onAuthStateChanged(authService, user => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <div>
      {init ? (
        <Router isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        'Loading...'
      )}
    </div>
  );
}

export default App;
