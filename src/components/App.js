import React, { useState, useEffect } from 'react';
import Router from './Router';
import { authService } from '../firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';

function App() {
  // 초기화 시켜줌
  const [init, setInit] = useState(false);
  const [newName, setNewName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    // 로그인 상태 확인
    onAuthStateChanged(authService, user => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: args =>
            updateProfile(user, { displayName: user.displayName }),
        });
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj(user);
    setNewName(user.displayName);
  };

  return (
    <div>
      {init ? (
        <Router
          isLoggedIn={isLoggedIn}
          refreshUser={refreshUser}
          userObj={userObj}
        />
      ) : (
        'Loading...'
      )}
    </div>
  );
}

export default App;
