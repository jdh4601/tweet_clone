import React, { useState } from 'react';

function Home() {
  const [tweet, setTweet] = useState('');
  const onSubmit = event => {
    event.preventDefault();
  };

  const onChange = event => {
    setTweet(event.target.value);
    console.log(tweet);
  };

  const onClick = () => {
    setTweet('');
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
      </div>
    </>
  );
}

export default Home;
