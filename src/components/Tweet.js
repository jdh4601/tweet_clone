import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';

function Tweet({ tweetObj, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete?');
    if (ok) {
      await deleteDoc(doc(db, `users/${tweetObj.id}`));
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
    console.log(`Updated text is ${newTweet}`);
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
