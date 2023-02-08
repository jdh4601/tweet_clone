import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { authService } from '../../firebase';
import './AuthForm.css';
import undraw1 from '../../assets/undraw_login_re_4vu2 1.png';
import undraw2 from '../../assets/undraw_login_re_4vu2 1 (1).png';

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState('');

  const onChange = event => {
    const {
      target: { name, value },
    } = event;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      if (newAccount) {
        // create new account
        const data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
        console.log('Congratulation!!!');
        console.log(`Created ID is ${data.user.email}`);
        console.log(`user id is ${data.user.uid}`);
        console.log(data);
      } else {
        // sign in
        const data = await signInWithEmailAndPassword(
          authService,
          email,
          password
        );
        console.log('SIGN IN\nWelcome!!!');
        console.log(data.user.email);
        console.log(data);
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
    setEmail('');
    setPassword('');
  };

  const toggleAccount = () => {
    setNewAccount(prev => !prev);
  };

  return (
    <>
      <form className="login-form" onSubmit={onSubmit}>
        {newAccount ? (
          <img className="login-img" src={undraw2} />
        ) : (
          <img className="login-img" src={undraw1} />
        )}
        <h2 className="auth-title">{newAccount ? 'Sign Up' : 'Login'}</h2>
        <input
          className="login-input"
          name="email"
          type="text"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          className="login-input"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
        />
        {error && <span className="login-error-message">{error}</span>}

        <span className="signin-span" onClick={toggleAccount}>
          {newAccount ? 'Sign In' : 'Create Account'}
        </span>
        <input
          className="login-btn"
          type="submit"
          value={newAccount ? 'Create new account' : 'Login'}
        />
      </form>
    </>
  );
}

export default AuthForm;
