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
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import Tweet from '../components/Tweet';
import { v4 as uuidv4 } from 'uuid';

function Home({ userObj }) {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [attachedFile, setAttachedFile] = useState('');

  // ✅ Add data
  const onSubmit = async event => {
    event.preventDefault();
    let attachmentUrl = '';
    // 첨부 파일 없을 경우?
    if (attachedFile !== '') {
      const attachmentRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachedFile,
        'data_url'
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }

    const tweetObj = {
      text: tweet,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await getDocs(collection(db, 'users'), tweetObj);

    try {
      const docRef = await addDoc(collection(db, 'users'), {
        text: tweet,
        createdAt: serverTimestamp(),
        creatorId: userObj.uid,
        email: userObj.email,
        attachmentUrl,
      });
      console.log('Document written with ID: ', docRef);
    } catch (err) {
      console.error('Error adding document: ', err);
    }

    setTweet(''); // form 비우기
    setAttachedFile(''); // file img src 비우기
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

  // // ✅ Delete file
  // const deleteFile = async () => {
  //   const refFromUrl = refFromURL(attachmentUrl);
  //   const deleteObj = await deleteObject(refFromUrl);
  // };

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

  const onFileChange = event => {
    const fileName = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = event => {
      setAttachedFile(event.currentTarget.result);
    };
    reader.readAsDataURL(fileName);
  };

  const onClearAttachment = event => {
    setAttachedFile('');
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
          <input type="file" accept="image/*" onChange={onFileChange} />
          {attachedFile && (
            <div>
              <img width="70px" height="150px" src={attachedFile} />
              <button onClick={onClearAttachment}>clear</button>
            </div>
          )}
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
