import React, { useState } from 'react';
import axios from 'axios';

const SignUpModal = ({ setShowSignUp, setUser, setShowSuccessPopup }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [timer, setTimer] = useState(38);
  const [error, setError] = useState('');

  // ✅ Backend URL - তোমার backend port অনুযায়ী
  const API_URL = import.meta.env.VITE_API_URL || '';

  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    console.log('Generated OTP:', otp);
    alert(`Your OTP is: ${otp}`);
    return otp;
  };

  const handleContinue = async () => {
    // Phone number validation
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError(''); // Clear previous errors

    try {
      // Check if user already exists
      const response = await axios.get(`${API_URL}/users?phone=${phoneNumber}`);
      
      console.log('User check response:', response.data);

      if (response.data.length > 0) {
        // User exists, just login
        const user = response.data[0];
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setShowSignUp(false);
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } else {
        // New user, show OTP input
        generateOTP();
        setShowOTPInput(true);
        startTimer();
      }
    } catch (err) {
      console.error('Error checking user:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const startTimer = () => {
    let timeLeft = 38;
    const interval = setInterval(() => {
      timeLeft--;
      setTimer(timeLeft);
      if (timeLeft === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOTP = otp.join('');
    
    if (enteredOTP.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    if (enteredOTP === generatedOTP) {
      try {
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          phone: phoneNumber,
          name: 'User',
          createdAt: new Date().toISOString()
        };

        console.log('Creating new user:', newUser);

        const response = await axios.post(`${API_URL}/users`, newUser);
        
        console.log('User created:', response.data);

        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
        setShowSignUp(false);
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } catch (err) {
        console.error('Error creating user:', err);
        setError('Failed to create account. Please try again.');
      }
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResendOTP = () => {
    generateOTP();
    setOtp(['', '', '', '', '', '']);
    setTimer(38);
    startTimer();
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={() => setShowSignUp(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={() => setShowSignUp(false)}>×</button>
        
        <div className="signup-banner">
          <img 
            src="https://images.meesho.com/images/marketing/1661417516766.webp" 
            alt="banner"
            width="433"
            height="200"
          />
        </div>

        <div className="signup-form">
          <h2 className="signup-title">
            {showOTPInput ? `Enter OTP sent to ${phoneNumber}` : 'Sign Up to view your profile'}
          </h2>

          {error && <div className="error-message">{error}</div>}

          {!showOTPInput ? (
            <>
              <div className="form-group">
                <div className="country-selector">
                  <div className="country-label">Country</div>
                  <div className="country-value">🇮🇳 +91</div>
                </div>

                <div className="input-container">
                  <label className="input-label">Phone Number</label>
                  <input
                    type="tel"
                    maxLength="10"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="phone-input"
                    placeholder="Enter 10-digit number"
                  />
                </div>
              </div>

              <button className="continue-button" onClick={handleContinue}>
                Continue
              </button>
            </>
          ) : (
            <>
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="otp-input"
                  />
                ))}
              </div>

              <div className="resend-section">
                {timer > 0 ? (
                  <span className="timer-text">Resend OTP in {timer}s</span>
                ) : (
                  <button className="resend-button" onClick={handleResendOTP}>
                    Resend OTP
                  </button>
                )}
              </div>

              <button className="continue-button" onClick={handleVerify}>
                Verify
              </button>

              <button 
                className="change-number-button" 
                onClick={() => {
                  setShowOTPInput(false);
                  setOtp(['', '', '', '', '', '']);
                  setError('');
                }}
              >
                Change Number
              </button>
            </>
          )}

          <p className="terms-text">
            By continuing, you agree to Meesho's{' '}
            <a href="https://www.meesho.com/legal/terms-conditions" className="terms-link">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="https://www.meesho.com/legal/privacy" className="terms-link">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
