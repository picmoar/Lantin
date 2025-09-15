import { useState } from 'react';

interface LoginFormProps {
  auth: {
    user: any;
    userProfile: any;
    isLoggedIn: boolean;
  };
  handleGoogleLogin: () => void;
  sendEmailCode: (email: string) => Promise<boolean>;
  handleEmailOtpLogin: (email: string, otp: string) => Promise<boolean>;
  handlePasscodeLogin: (email: string, passcode: string) => Promise<boolean>;
  setupPasscode: (passcode: string) => Promise<boolean>;
  handleMobileTestLogin: () => void;
}

export default function LoginForm({ 
  auth, 
  handleGoogleLogin,
  sendEmailCode,
  handleEmailOtpLogin,
  handlePasscodeLogin,
  setupPasscode,
  handleMobileTestLogin 
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasscodeSetup, setShowPasscodeSetup] = useState(false);
  const [showPasscodeLogin, setShowPasscodeLogin] = useState(false);
  const [passcode, setPasscode] = useState('');

  const handleEmailLogin = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await sendEmailCode(email);
      if (success) {
        setOtpSent(true);
      }
    } catch (error: any) {
      alert('Failed to send 6-digit code: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit code');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await handleEmailOtpLogin(email, otp);
      if (success) {
        // Check if user needs to set up a passcode
        setShowPasscodeSetup(true);
      }
    } catch (error: any) {
      alert('Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasscodeSetup = async () => {
    if (!passcode || passcode.length < 4) {
      alert('Please enter a passcode with at least 4 digits');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await setupPasscode(passcode);
      if (success) {
        setShowPasscodeSetup(false);
        setOtpSent(false);
        setOtp('');
        setPasscode('');
        setEmail('');
      }
    } catch (error: any) {
      alert('Failed to setup passcode: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasscodeAuth = async () => {
    if (!email || !passcode) {
      alert('Please enter both email and passcode');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await handlePasscodeLogin(email, passcode);
      if (success) {
        // Clear form on successful login
        setEmail('');
        setPasscode('');
        setShowPasscodeLogin(false);
      }
    } catch (error: any) {
      alert('Login failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 200px)',
      padding: '40px 20px',
      backgroundColor: '#fafbfc'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '8px'
        }}>
          Welcome to Lantin
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          lineHeight: '1.5',
          marginBottom: '0'
        }}>
          Sign in to save your favorite artists, edit your profile, and unlock personalized features.
        </p>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '320px'}}>
        {!otpSent && !showPasscodeLogin ? (
          <>
            {/* Email Login Section */}
            <div style={{
              padding: '24px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h4 style={{margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#374151', textAlign: 'center'}}>
                📧 Email Login
              </h4>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '16px',
                  backgroundColor: '#f9fafb',
                  boxSizing: 'border-box',
                  outline: 'none',
                  marginBottom: '16px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <button 
                onClick={handleEmailLogin}
                disabled={isLoading || !email}
                style={{
                  backgroundColor: isLoading || !email ? '#9ca3af' : '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px 20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading || !email ? 'not-allowed' : 'pointer',
                  width: '100%'
                }}
              >
                {isLoading ? '⏳ Sending Code...' : '📧 Send 6-Digit Code'}
              </button>
            </div>
            
            {/* Quick Login Section */}
            <div style={{
              padding: '24px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h4 style={{margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#374151', textAlign: 'center'}}>
                🚀 Quick Login
              </h4>
              <button 
                onClick={handleGoogleLogin}
                style={{
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px 20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                  marginBottom: '12px'
                }}
              >
                🚀 Sign in with Google
              </button>
              <button 
                onClick={handleMobileTestLogin}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px 20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                  marginBottom: '12px'
                }}
              >
                📱 Demo Login
              </button>
              
              <button 
                onClick={() => setShowPasscodeLogin(true)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#8b5cf6',
                  border: '2px solid #8b5cf6',
                  borderRadius: '10px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                🔒 Login with Passcode
              </button>
            </div>
          </>
        ) : showPasscodeLogin ? (
          /* Passcode Login */
          <div style={{
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #8b5cf6',
            boxShadow: '0 1px 3px rgba(139, 92, 246, 0.1)'
          }}>
            <h4 style={{margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600', color: '#7c3aed', textAlign: 'center'}}>
              🔒 Login with Passcode
            </h4>
            <p style={{fontSize: '14px', color: '#8b5cf6', marginBottom: '20px', textAlign: 'center'}}>
              Enter your email and 4-digit passcode
            </p>
            
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '16px',
                backgroundColor: '#f8fafc',
                boxSizing: 'border-box',
                outline: 'none',
                marginBottom: '12px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            
            <input
              type="password"
              placeholder="Enter 4-digit passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #8b5cf6',
                borderRadius: '10px',
                fontSize: '20px',
                textAlign: 'center',
                backgroundColor: '#faf5ff',
                boxSizing: 'border-box',
                outline: 'none',
                marginBottom: '16px',
                letterSpacing: '6px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = '#8b5cf6'}
            />
            
            <button 
              onClick={handlePasscodeAuth}
              disabled={isLoading || !email || passcode.length < 4}
              style={{
                backgroundColor: isLoading || !email || passcode.length < 4 ? '#9ca3af' : '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '14px 20px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading || !email || passcode.length < 4 ? 'not-allowed' : 'pointer',
                width: '100%',
                marginBottom: '12px'
              }}
            >
              {isLoading ? '⏳ Signing In...' : '🔓 Sign In'}
            </button>
            
            <button
              onClick={() => {
                setShowPasscodeLogin(false);
                setEmail('');
                setPasscode('');
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: 'none',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              ← Back to other login options
            </button>
          </div>
        ) : showPasscodeSetup ? (
          /* Passcode Setup */
          <div style={{
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #fbbf24',
            boxShadow: '0 1px 3px rgba(251, 191, 36, 0.1)'
          }}>
            <h4 style={{margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600', color: '#92400e', textAlign: 'center'}}>
              🔒 Set Up Your Passcode
            </h4>
            <p style={{fontSize: '14px', color: '#a16207', marginBottom: '20px', textAlign: 'center'}}>
              Create a 4-digit passcode for quick future logins
            </p>
            <input
              type="password"
              placeholder="Enter 4-digit passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #fbbf24',
                borderRadius: '10px',
                fontSize: '20px',
                textAlign: 'center',
                backgroundColor: '#fffbeb',
                boxSizing: 'border-box',
                outline: 'none',
                marginBottom: '16px',
                letterSpacing: '8px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
              onBlur={(e) => e.target.style.borderColor = '#fbbf24'}
            />
            <button 
              onClick={handlePasscodeSetup}
              disabled={isLoading || passcode.length < 4}
              style={{
                backgroundColor: isLoading || passcode.length < 4 ? '#9ca3af' : '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '14px 20px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading || passcode.length < 4 ? 'not-allowed' : 'pointer',
                width: '100%'
              }}
            >
              {isLoading ? '⏳ Setting up...' : '✅ Set Up Passcode'}
            </button>
          </div>
        ) : (
          /* OTP Verification */
          <div style={{
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #10b981',
            boxShadow: '0 1px 3px rgba(16, 185, 129, 0.1)'
          }}>
            <h4 style={{margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#059669', textAlign: 'center'}}>
              📧 Check Your Email!
            </h4>
            <p style={{fontSize: '14px', color: '#047857', marginBottom: '20px', textAlign: 'center'}}>
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #10b981',
                borderRadius: '10px',
                fontSize: '20px',
                textAlign: 'center',
                backgroundColor: '#f0fdf4',
                boxSizing: 'border-box',
                outline: 'none',
                marginBottom: '16px',
                letterSpacing: '6px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#10b981'}
            />
            <button 
              onClick={handleOtpVerification}
              disabled={isLoading || otp.length !== 6}
              style={{
                backgroundColor: isLoading || otp.length !== 6 ? '#9ca3af' : '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '14px 20px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading || otp.length !== 6 ? 'not-allowed' : 'pointer',
                width: '100%',
                marginBottom: '12px'
              }}
            >
              {isLoading ? '⏳ Verifying...' : '✅ Verify Code'}
            </button>
            <button
              onClick={() => {
                setOtpSent(false);
                setOtp('');
                setEmail('');
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#059669',
                border: '1px solid #10b981',
                borderRadius: '10px',
                padding: '10px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Try different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}