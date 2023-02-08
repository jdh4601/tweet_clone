import React from 'react';
import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
} from 'firebase/auth';
import AuthForm from '../../components/authform/AuthForm';
import './Auth.css';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import rectangle1 from '../../assets/Rectangle 30.png';
import rectangle2 from '../../assets/Rectangle 29.png';

function Auth() {
  const auth = getAuth(); // auth 인스턴스
  // google, github 계정으로 로그인
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
        <button className="google-btn" onClick={onSocialClick} name="google">
          <FcGoogle className="social-icon" />
        </button>
        <button className="github-btn" onClick={onSocialClick} name="github">
          <FaGithub className="social-icon" />
        </button>
      </div>
    </div>
  );
}

export default Auth;
