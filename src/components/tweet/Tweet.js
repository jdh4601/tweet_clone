import React, { useState } from 'react';
import { db, storage } from '../../firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import './Tweet.css';

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
        <form onSubmit={onSubmit} className="tweet-form">
          <input
            className="input-tweet"
            type="text"
            placeholder="Edit your tweet"
            value={newTweet}
            onChange={onChange}
            required
          />
          <div className="btn-container">
            <button onClick={onSubmit}>Update</button>
            <button onClick={toggleEditing}>Cancel</button>
          </div>
        </form>
      ) : (
        <div key={tweetObj.id} className="tweet-list-container">
          {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} />}
          <div key={tweetObj.id} className="tweet-list">
            <h4 className="tweet-text">{tweetObj.text}</h4>
            {isOwner && (
              <div className="btn-container">
                <button onClick={onDeleteClick}>
                  <AiOutlineDelete size={25} />
                </button>
                <button onClick={toggleEditing}>
                  <AiOutlineEdit size={25} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Tweet;
