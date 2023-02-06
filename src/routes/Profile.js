import React, { useEffect, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

function Profile({ userObj, refreshUser }) {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const auth = getAuth();
  const navigate = useNavigate();

  const onLogOutClick = () => {
    auth.signOut(auth);
    navigate('/');
  };

  const getMyTweets = async () => {
    const q = query(
      collection(db, 'users'),
      where('creatorId', '==', userObj.uid),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    // DB 필터링하기
    querySnapshot.forEach(doc => console.log(doc.id, '=>', doc.data()));
  };

  useEffect(() => {
    getMyTweets();
  }, []);

  const onSubmit = async e => {
    e.preventDefault();
    const displayName = userObj.displayName;
    const email = userObj.email;
    const photoUrl = userObj.photoURL;
    const emailVerified = userObj.emailVerified;
    // 가져온 이름과 입력한 이름이 다르면?? -> 다시 update
    if (displayName !== newDisplayName) {
      updateProfile(auth.currentUser, {
        displayName: displayName,
        email: email,
        photoUrl: photoUrl,
        emailVerified: emailVerified,
      });
      refreshUser();
    }
  };

  const onChange = e => {
    setNewDisplayName(e.target.value);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What display"
          value={newDisplayName}
          onChange={onChange}
        />
        <input type="submit" placeholder="update profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
}

export default Profile;
