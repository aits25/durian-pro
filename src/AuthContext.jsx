import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ตรวจสอบ token เมื่อ app เริ่มต้น
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    const savedToken = localStorage.getItem('userAuthToken');
    
    if (savedUserData && savedToken) {
      try {
        const userData = JSON.parse(savedUserData);
        setUser(userData);
      } catch (error) {
        console.error('Failed to restore user data:', error);
        localStorage.removeItem('userData');
        localStorage.removeItem('userAuthToken');
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('userAuthToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
