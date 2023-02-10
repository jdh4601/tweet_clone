import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

import { db } from '../firebase';
import Tweet from '../components/tweet/Tweet';
import TweetForm from '../components/tweetForm/TweetForm';

function Home({ userObj }) {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    // ✅ 실시간 데이터 가져오기
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    onSnapshot(q, snapshot => {
      const tweetArr = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArr);
    });
  }, []);

  return (
    <div>
      <TweetForm userObj={userObj} />
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
  );
}

export default Home;
