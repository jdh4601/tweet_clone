import React, { useState } from 'react';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

function TweetForm({ userObj }) {
  const [tweet, setTweet] = useState('');
  const [attachedFile, setAttachedFile] = useState('');
  // ✅ Add data
  const onSubmit = async e => {
    e.preventDefault();
    let attachmentUrl = ''; // 첨부파일 url
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

    try {
      const docRef = await addDoc(collection(db, 'users'), tweetObj);
      console.log('Document written with ID: ', docRef);
    } catch (err) {
      console.log('Error adding document: ', err);
    }

    setTweet(''); // form 비우기
    setAttachedFile(''); // file img src 비우기
  };

  const onChange = ({ target: { value } }) => {
    setTweet(value);
  };

  const onFileChange = event => {
    const fileName = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = event => {
      setAttachedFile(event.currentTarget.result);
    };
    reader.readAsDataURL(fileName);
  };

  const onClearAttachment = () => {
    setAttachedFile('');
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        onChange={onChange}
        value={tweet}
        placeholder="Enter a text"
        maxLength={50}
      />
      <input type="submit" value="Tweet" onSubmit={onSubmit} />
      <input type="file" accept="image/*" onChange={onFileChange} />
      {attachedFile && (
        <div>
          <img width="70px" height="150px" src={attachedFile} />
          <button onClick={onClearAttachment}>clear</button>
        </div>
      )}
    </form>
  );
}

export default TweetForm;
