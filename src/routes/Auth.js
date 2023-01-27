import React, { useState } from 'react';
import { authService } from '../firebase';
import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState('');
  const auth = getAuth(); // auth 인스턴스

  const onChange = event => {
    const {
      target: { name, value },
    } = event;

    if (name === 'email') {
      setEmail(value);
      console.log(value);
    } else if (name === 'password') {
      setPassword(value);
      console.log(value);
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      if (newAccount) {
        // create new account, signup
        const data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
        console.log(data);
      } else {
        // signin
        const data = await signInWithEmailAndPassword(
          authService,
          email,
          password
        );
        console.log('SIGN IN\nWelcome!');
        const emailData = data.user.email;
        console.log(emailData);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => {
    setNewAccount(prev => !prev);
  };

  const onSocialClick = async event => {
    const {
      target: { name },
    } = event;
    let provider;

    if (name === 'google') {
      provider = new GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new GithubAuthProvider();
    }
    const popUpData = await signInWithPopup(auth, provider);
    console.log(popUpData);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
        />
        <input
          type="submit"
          value={newAccount ? 'Create new account' : 'Login'}
        />
      </form>
      <span>{error}</span>
      <span onClick={toggleAccount}>
        {newAccount ? 'Sign In' : 'Create Account'}
      </span>
      <div>
        <button onClick={onSocialClick} name="google">
          Google로 계속하기
        </button>
        <button onClick={onSocialClick} name="github">
          GitHub로 계속하기
        </button>
      </div>
    </div>
  );
}

export default Auth;
