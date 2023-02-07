import React, { useEffect, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db, authService } from '../firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

function Profile({ userObj, refreshUser }) {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const auth = getAuth();
  const navigate = useNavigate();

  const onLogOutClick = () => {
    auth.signOut(auth);
    navigate('/');
  };

  // db에서 내 트윗 가져오기 -> created된 순서로 오름차순 정렬
  const getMyTweets = async () => {
    const q = query(
      collection(db, 'users'),
      where('creatorId', '==', userObj.uid),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => console.log(doc.id, '=>', doc.data()));
  };

  useEffect(() => {
    getMyTweets();
  }, []);

  // ✅ profile update
  const onSubmit = async e => {
    e.preventDefault();
    // 가져온 이름과 현재 입력한 이름이 다르면?? -> 현재 입력한 값으로 다시 profile update!!
    if (userObj.displayName !== newDisplayName) {
      window.alert(
        `"${userObj.displayName}" 님의 프로필 이름이 "${newDisplayName}" 으로 변경되었습니다`
      );
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser(); // user profile 업데이트
    }
    setNewDisplayName('');
  };

  const onChange = e => {
    setNewDisplayName(e.target.value);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="이름을 입력하세요"
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
