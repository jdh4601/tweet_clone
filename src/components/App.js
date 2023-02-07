import React, { useState, useEffect } from 'react';
import Router from './Router';
import { authService } from '../firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';

function App() {
  // 초기화 시켜줌
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    // 로그인 상태 확인
    onAuthStateChanged(authService, user => {
      if (user) {
        // local에서 로그인 -> display name 이 아무것도 없다면?
        if (user.displayName == null) {
          const emailIdx = user.email.indexOf('@');
          const emailName = user.email.substring(0, emailIdx);
          user.updateProfile({
            displayName: emailName,
          });
        }
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

  // user를 업데이트해서 화면에 띄워주는 함수
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj(user);
  };

  return (
    <>
      {init ? (
        <Router
          isLoggedIn={isLoggedIn}
          refreshUser={refreshUser}
          userObj={userObj}
        />
      ) : (
        'Loading...'
      )}
    </>
  );
}

export default App;
