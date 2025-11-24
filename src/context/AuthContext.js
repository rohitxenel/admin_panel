'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Load fake user if saved
  useEffect(() => {
    const storedUser = localStorage.getItem('auth-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // REAL LOGIN (ONLY THIS PART CHANGED)
  const login = async ({ email, password }) => {
    try {
      const res = await fetch("http://mobileappindia.com:5001/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Invalid credentials");
      }

      const token = resData?.data?.Token;
      if (!token) {
        throw new Error("Token missing from API response");
      }

      const userInfo = {
        id: "admin",
        email,
      };

      localStorage.setItem("auth-user", JSON.stringify(userInfo));
      document.cookie = `auth-token=${token}; path=/`;

      setUser(userInfo);
      router.push("/admin/dashboard");

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert(error.message);
    }
  };

  const logout = async () => {
    document.cookie = "auth-token=; Max-Age=0; path=/";
    localStorage.removeItem("auth-user");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
