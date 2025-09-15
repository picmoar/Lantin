import { useState } from 'react';

interface AuthenticationSectionProps {
  onEmailOtpLogin: (email: string, otp: string) => Promise<boolean>;
  onMobileTestLogin: () => void;
  onSendEmailCode: (email: string) => Promise<boolean>;
  onLogin: () => void;
}

export default function AuthenticationSection({
  onEmailOtpLogin,
  onMobileTestLogin,
  onSendEmailCode,
  onLogin
}: AuthenticationSectionProps) {
  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otp-verify'>('signup');

  const handleEmailSignup = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const success = await onSendEmailCode(email);
      if (success) {
        setOtpSent(true);
        setAuthMode('otp-verify');
      }
    } catch (error: any) {
      alert('Failed to send verification code: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      alert('Please enter the 6-digit verification code');
      return;
    }

    setIsLoading(true);
    try {
      const success = await onEmailOtpLogin(email, emailOtp);
      if (success) {
        alert('Email verified! Welcome to Lantin!');
      }
    } catch (error: any) {
      alert('Failed to verify code: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMobileTestLoginClick = () => {
    const origin = window.location.origin;
    const hostname = window.location.hostname;
    const isMobile = hostname.startsWith('192.168.');

    if (isMobile) {
      alert('📱 For mobile testing, use Demo Login for best experience.');
      onMobileTestLogin();
    } else {
      const debugInfo = `🔍 DEBUG INFO:\n\nCurrent URL: ${origin}\nHostname: ${hostname}\nAccess Type: Desktop (localhost)\n\nUsing demo login for testing...`;
      alert(debugInfo);
      onMobileTestLogin();
    }
  };

  return (
    <div style={{
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      <div style={{fontSize: '48px', marginBottom: '16px'}}>👤</div>
      <h3 style={{fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '8px'}}>
        Your Profile
      </h3>
      <p style={{
        fontSize: '16px',
        color: '#6b7280',
        marginBottom: '24px',
        lineHeight: '1.5'
      }}>
        Sign in to save your favorite artists, edit your profile, and unlock personalized features.
      </p>

      <div style={{display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center'}}>
        <div style={{width: '100%', marginBottom: '8px'}}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '16px',
              backgroundColor: 'white',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {authMode === 'signup' ? (
          <>
            <button
              onClick={handleEmailSignup}
              disabled={isLoading || !email}
              style={{
                backgroundColor: isLoading || !email ? '#9ca3af' : '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading || !email ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoading ? '⏳ Sending code...' : '📧 Send 6-Digit Code'}
            </button>
          </>
        ) : authMode === 'otp-verify' ? (
          <>
            <p style={{ fontSize: '14px', color: '#047857', marginBottom: '12px', textAlign: 'center' }}>
              Check your email for a 6-digit verification code
            </p>

            <div style={{width: '100%', marginBottom: '8px'}}>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '18px',
                  backgroundColor: 'white',
                  boxSizing: 'border-box',
                  outline: 'none',
                  textAlign: 'center',
                  letterSpacing: '4px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <button
              onClick={handleOtpVerification}
              disabled={isLoading || emailOtp.length !== 6}
              style={{
                backgroundColor: isLoading || emailOtp.length !== 6 ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading || emailOtp.length !== 6 ? 'not-allowed' : 'pointer',
                width: '100%',
                marginBottom: '8px'
              }}
            >
              {isLoading ? '⏳ Verifying...' : '✅ Verify Code'}
            </button>

            <button
              onClick={() => {
                setAuthMode('signup');
                setEmailOtp('');
                setOtpSent(false);
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: 'none',
                padding: '8px 16px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              ← Resend code
            </button>
          </>
        ) : null}

        {/* Demo Login for Testing */}
        <button
          onClick={handleMobileTestLoginClick}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '16px',
            width: '100%'
          }}
        >
          🚀 Demo Login (For Testing)
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          margin: '8px 0'
        }}>
          <div style={{flex: 1, height: '1px', backgroundColor: '#e5e7eb'}}></div>
          <span style={{fontSize: '14px', color: '#6b7280'}}>or</span>
          <div style={{flex: 1, height: '1px', backgroundColor: '#e5e7eb'}}></div>
        </div>

        <button
          onClick={onLogin}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            width: '100%'
          }}
        >
          🚀 Sign in with Google
        </button>
      </div>
    </div>
  );
}