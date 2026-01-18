import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Sprout } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '931524219693-e1j7d1d0u0u0u0u0u0u0u0u0u0u0u0u0.apps.googleusercontent.com';

const LoginPage = ({ onLoginSuccess }) => {
  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        token: credentialResponse.credential,
      };
      
      // เก็บ user data ใน localStorage
      localStorage.setItem('userAuthToken', credentialResponse.credential);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      onLoginSuccess(userData);
    } catch (error) {
      console.error('Login error:', error);
      alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
  };

  const handleLoginError = () => {
    alert('การเข้าสู่ระบบล้มเหลว กรุณาลองใหม่');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-25 to-green-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6">
              <div className="relative flex items-center justify-center rounded-full border-4 border-green-800 bg-white overflow-hidden w-16 h-16">
                <div className="z-10 bg-green-800 rounded-full p-1 flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-black text-green-900 leading-none tracking-tighter uppercase italic mb-2">
              DURIAN PRO
            </h1>
            <p className="text-sm font-bold text-gray-400 tracking-[0.2em] uppercase">KrungChing</p>
            <p className="text-gray-600 text-sm mt-4">ระบบจัดการสวนทุเรียน</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">ยินดีต้อนรับ</h2>
              <p className="text-gray-500 text-sm">เข้าสู่ระบบด้วยบัญชี Google เพื่อจัดการสวนทุเรียนของคุณ</p>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                text="signin_with"
                theme="outline"
                size="large"
                locale="th_TH"
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 font-medium uppercase">หรือ</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-green-600">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">บันทึกการขาย</p>
                  <p className="text-xs text-gray-500">จัดเก็บข้อมูลการตัดทุเรียนและยอดขาย</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-green-600">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">ตารางงาน</p>
                  <p className="text-xs text-gray-500">วางแผนการดูแลและฉีดยา</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold text-green-600">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">ติดตามค่าใช้จ่าย</p>
                  <p className="text-xs text-gray-500">บันทึกรายจ่ายและหลักฐานการจ่ายเงิน</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-[10px] text-gray-400 text-center pt-4">
              เมื่อเข้าสู่ระบบ คุณตกลงที่จะใช้บริการของเรา
            </p>
          </div>

          {/* Version Info */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-400 font-bold tracking-wider">v.2.5 Beta</p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
