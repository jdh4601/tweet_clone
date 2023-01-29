import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

function Home() {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);

  // 1. 데이터 추가하기
  const onSubmit = async event => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        tweet,
        createdAt: serverTimestamp(),
      });
      console.log('Document written with ID: ', docRef);
    } catch (err) {
      console.error('Error adding document: ', err);
    }
  };

  // 2. 데이터 읽기
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
  }, []);

  const onChange = ({ target: { value } }) => {
    setTweet(value);
  };

  const onClick = async () => {
    console.log(tweets);
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
            <div key={tweet.id}>
              <h4>{tweet.tweet}</h4>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
