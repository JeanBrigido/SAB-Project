import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const { signIn } = useAuth();

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome to Betel Church</h2>
        <button 
          onClick={() => signIn()} 
          className="submit-btn"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Login;