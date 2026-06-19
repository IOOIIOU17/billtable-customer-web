import { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../services/firebase';

// จัดการ flow OTP: ส่งโค้ดไปเบอร์โทร -> ตรวจสอบโค้ดที่ผู้ใช้กรอก
export function useOtp() {
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ส่ง SMS OTP ไปที่เบอร์โทร (ต้องเป็นรูปแบบ +1XXXXXXXXXX ตามมาตรฐานสากล)
  const sendOtp = async (phoneNumber) => {
    setLoading(true);
    setError('');
    try {
      // reCAPTCHA แบบ invisible — ป้องกัน bot ส่ง SMS รัวๆ
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }
      const result = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(result);
      return true;
    } catch (err) {
      setError(err.message || 'ส่ง OTP ไม่สำเร็จ ลองใหม่อีกครั้ง');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ตรวจสอบโค้ด 6 หลักที่ผู้ใช้กรอก
  const verifyOtp = async (code) => {
    if (!confirmationResult) {
      setError('กรุณาขอ OTP ใหม่อีกครั้ง');
      return false;
    }
    setLoading(true);
    setError('');
    try {
      const result = await confirmationResult.confirm(code);
      return result.user; // Firebase user object — มี phoneNumber ที่ verify แล้ว
    } catch (err) {
      setError('รหัส OTP ไม่ถูกต้อง');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, verifyOtp, loading, error };
}
