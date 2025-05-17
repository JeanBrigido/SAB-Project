import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const VerifyEmail = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, navigate]);

  return (
    <div className="auth-container">
      <h2>Verify Your Email</h2>
      <div className="verify-email-content">
        <p>
          We've sent a verification email to <strong>{user?.email}</strong>.
          Please check your email and click the verification link.
        </p>
        <p className="countdown">
          {canResend ? (
            <button 
              className="resend-button" 
              onClick={() => {/* Add resend logic */}}
            >
              Resend Email
            </button>
          ) : (
            `Can resend in: ${timeLeft}s`
          )}
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;