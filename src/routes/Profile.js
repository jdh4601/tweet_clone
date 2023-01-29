import React from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const auth = getAuth(); // auth 인스턴스
  const navigate = useNavigate();

  const onLogOutClick = () => {
    auth.signOut(auth);
    navigate('/');
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
}

export default Profile;
