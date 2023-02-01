import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import Tweet from '../components/Tweet';

function Home({ userObj }) {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);

  // ✅ Add data
  const onSubmit = async event => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        text: tweet,
        createdAt: serverTimestamp(),
        creatorId: userObj.uid,
        email: userObj.email,
      });
      console.log('Document written with ID: ', docRef);
    } catch (err) {
      console.error('Error adding document: ', err);
    }
    setTweet('');
  };

  // ✅ Read data
  const getTweets = async () => {
    const dbTweets = await getDocs(collection(db, 'users'));
    dbTweets.forEach(document => {
      const tweetObj = {
        ...document.data(),
        id: document.id,
      };
      setTweets(prev => [tweetObj, ...prev]);
    });
  };

  useEffect(() => {
    getTweets();
    // ✅ 실시간 데이터 가져오기
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    onSnapshot(q, snapshot => {
      const tweetArr = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(tweetArr);
      setTweets(tweetArr);
    });
  }, []);

  const onChange = ({ target: { value } }) => {
    setTweet(value);
  };

  const onClick = async () => {
    onSubmit();
  };

  return (
    <>
      <div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            onChange={onChange}
            value={tweet}
            placeholder="Enter a text"
            maxLength={50}
          />
          <input type="submit" value="Tweet" onClick={onClick} />
        </form>
        <div>
          {tweets.map(tweet => (
            <Tweet
              key={tweet.id}
              tweetObj={tweet}
              isOwner={tweet.creatorId === userObj.uid}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
