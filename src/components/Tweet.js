import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

function Tweet({ tweetObj, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete?');
    const attachmentRef = ref(storage, tweetObj.attachmentURL);
    if (ok) {
      await deleteDoc(doc(db, `users/${tweetObj.id}`));
      if (tweetObj.attachmentUrl !== '') {
        try {
          await deleteObject(attachmentRef);
        } catch (err) {
          window.alert('파일을 삭제하는데 실패했습니다');
        }
      }
    }
  };

  const toggleEditing = () => {
    setEditing(prev => !prev);
  };

  const onChange = e => {
    setNewTweet(e.target.value);
  };

  const onSubmit = async e => {
    e.preventDefault();
    // ✅ Update data
    const newTweetRef = doc(db, `users/${tweetObj.id}`);
    await updateDoc(newTweetRef, {
      text: newTweet,
    });
    setEditing(false);
  };

  return (
    <>
      {editing ? (
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Edit your tweet"
            value={newTweet}
            onChange={onChange}
            required
          />
          <button onClick={onSubmit}>Update</button>
          <button onClick={toggleEditing}>Cancel</button>
        </form>
      ) : (
        <div key={tweetObj.id}>
          <h4>{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && (
            <img src={tweetObj.attachmentUrl} width="80px" height="130px" />
          )}
          {isOwner && (
            <div>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Tweet;
