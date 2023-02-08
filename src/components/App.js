import React, { useState, useEffect } from 'react';
import Router from './Router';
import { authService } from '../firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import ClipLoader from 'react-spinners/ClipLoader';
import '../App.css';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로그인 상태 확인
    onAuthStateChanged(authService, user => {
      if (user) {
        console.log(user);
        // local에서 로그인 -> display name 이 아무것도 없다면?? -> updateProfile 다시 업데이트
        if (user.displayName == null) {
          const emailIdx = user.email.indexOf('@');
          const emailName = user.email.substring(0, emailIdx);
          console.log(emailName);
          updateProfile(user, {
            displayName: emailName,
            uid: user.uid,
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
      setLoading(false);
      setInit(true);
    });
  }, []);

  // user를 업데이트해서 화면에 띄워주는 함수
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj(user);
  };

  return (
    <div className="App">
      {init ? (
        <Router
          isLoggedIn={isLoggedIn}
          refreshUser={refreshUser}
          userObj={userObj}
        />
      ) : (
        <div className="loader-container">
          <ClipLoader size={120} color={'#0B6EFE'} />
        </div>
      )}
    </div>
  );
}

export default App;
