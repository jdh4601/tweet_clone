import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import {
  getAuth,
  signInWithPopup,
  TwitterAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import AuthForm from '../../components/authform/AuthForm';
import './Auth.css';
import rectangle1 from '../../assets/Rectangle 30.png';
import rectangle2 from '../../assets/Rectangle 29.png';

function Auth() {
  const auth = getAuth();
  const onSocialClick = async event => {
    const {
      target: { name },
    } = event;

    let provider;

    if (name === 'google') {
      provider = new GoogleAuthProvider();
    } else if (name === 'twitter') {
      provider = new TwitterAuthProvider();
    } else if (name === 'facebook') {
      provider = new FacebookAuthProvider();
    }
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="auth-container">
      <AuthForm />
      <div className="sign-up-with">
        <img src={rectangle2} />
        <p>or sign up with</p>
        <img src={rectangle1} />
      </div>
      <div className="social-login">
        <Button
          className="social-btn"
          color="google plus"
          onClick={onSocialClick}
          name="google"
        >
          <Icon name="google plus" /> Google Plus
        </Button>
        <Button
          className="social-btn"
          color="twitter"
          onClick={onSocialClick}
          name="twitter"
        >
          <Icon name="twitter" /> Twitter
        </Button>
        <Button
          className="social-btn"
          color="facebook"
          onClick={onSocialClick}
          name="facebook"
        >
          <Icon name="facebook" /> Facebook
        </Button>
      </div>
    </div>
  );
}

export default Auth;
