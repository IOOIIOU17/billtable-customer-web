import { useState } from 'react';
import { subscribePush } from '../services/pushNotification';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import billTableLogo from '../assets/billtable-logo.png';
import { useOtp } from '../hooks/useOtp';

export default function Login() {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, loading: otpLoading, error: otpError } = useOtp();
  const [step, setStep] = useState('form'); // 'form' -> 'otp' -> done
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ขั้นที่ 1: validate ฟอร์ม แล้วส่ง OTP ไปที่เบอร์โทร
  const handleSendOtp = async () => {
    if (!form.name || !form.email || !form.password || !form.phone) {
      setError('Please fill in all required fields');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError('');
    // เบอร์ต้องเป็นรูปแบบสากล +1XXXXXXXXXX — เติม +1 ให้อัตโนมัติถ้ายังไม่มี
    const formattedPhone = form.phone.startsWith('+') ? form.phone : `+1${form.phone.replace(/\D/g, '')}`;
    const sent = await sendOtp(formattedPhone);
    if (sent) setStep('otp');
  };

  // ขั้นที่ 2: ตรวจสอบโค้ด OTP แล้วค่อยสร้างบัญชีจริง
  const handleVerifyAndRegister = async () => {
    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }
    setError('');
    const firebaseUser = await verifyOtp(otpCode);
    if (!firebaseUser) {
      setError('Invalid code. Please try again.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: 'customer'
      });
      const token = res.data?.accessToken || res.data?.data?.token || res.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        subscribePush(api, 'customer');
        navigate('/theme');
      } else {
        setError('No token received. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '16px',
    fontFamily: "'Patrick Hand', cursive", fontSize: '16px',
    border: '1.5px solid #1A1A1A', borderRadius: '12px',
    background: '#FEFEFE', color: '#1A1A1A',
    outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FEFEFE', maxWidth: '480px', margin: '0 auto', padding: '24px', fontFamily: "'Patrick Hand', cursive", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      <div style={{ textAlign: 'center', marginBottom: '32px', width: '100%' }}>
        <img src={billTableLogo} alt="BillTable" style={{ height: '64px', objectFit: 'contain', display: 'block', margin: '0 auto 8px' }} />
        <p style={{ fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#999', margin: 0 }}>
          {step === 'form' ? 'Create your account' : 'Verify your phone'}
        </p>
      </div>

      {step === 'form' && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '8px', width: '100%' }}>
            <input type="text" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            <input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            <input type="tel" placeholder="Phone number (e.g. 2135551234)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} />
          </div>

          <p style={{ fontFamily: "'Kalam', cursive", fontSize: '12px', color: '#999', width: '100%', marginBottom: '16px', lineHeight: '1.6' }}>
            Password must be 8-10 characters, include uppercase, lowercase, number, and special character (e.g. !@#$%)
          </p>

          {(error || otpError) && <p style={{ color: 'red', fontFamily: "'Kalam', cursive", fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{error || otpError}</p>}

          <button onClick={handleSendOtp} disabled={otpLoading} style={{ width: '100%', padding: '16px', background: otpLoading ? '#999' : '#1A1A1A', color: '#FEFEFE', border: 'none', borderRadius: '12px', fontFamily: "'Caveat', cursive", fontSize: '1.2rem', cursor: otpLoading ? 'not-allowed' : 'pointer', letterSpacing: '1px', marginBottom: '16px' }}>
            {otpLoading ? 'Sending code...' : 'Send verification code →'}
          </button>
        </>
      )}

      {step === 'otp' && (
        <>
          <p style={{ fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#666', width: '100%', marginBottom: '16px', textAlign: 'center' }}>
            We sent a 6-digit code to {form.phone}
          </p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
            style={{ ...inputStyle, textAlign: 'center', fontSize: '24px', letterSpacing: '8px', marginBottom: '16px' }}
          />

          {(error || otpError) && <p style={{ color: 'red', fontFamily: "'Kalam', cursive", fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{error || otpError}</p>}

          <button onClick={handleVerifyAndRegister} disabled={loading || otpLoading} style={{ width: '100%', padding: '16px', background: (loading || otpLoading) ? '#999' : '#1A1A1A', color: '#FEFEFE', border: 'none', borderRadius: '12px', fontFamily: "'Caveat', cursive", fontSize: '1.2rem', cursor: (loading || otpLoading) ? 'not-allowed' : 'pointer', letterSpacing: '1px', marginBottom: '16px' }}>
            {loading ? 'Creating account...' : 'Verify & create account'}
          </button>

          <p onClick={() => setStep('form')} style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#999', textAlign: 'center', cursor: 'pointer', textDecoration: 'underline' }}>
            ← Back to edit info
          </p>
        </>
      )}

      <p style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#999', textAlign: 'center', margin: '16px 0 0 0' }}>
        Already have an account?{' '}
        <span onClick={() => navigate('/signup')} style={{ color: '#1A1A1A', cursor: 'pointer', textDecoration: 'underline' }}>
          Login
        </span>
      </p>

      <div id="recaptcha-container"></div>

    </div>
  );
}
