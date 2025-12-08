'use client';
import { createContext, useContext, useState, useEffect } from 'react';
//import { AuthProvider } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


//this is a box that will store autheniticaion information and  functions 
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

 // Load user on mount (ONLY if both localStorage + token exist)
useEffect(() => {
  const storedUser = localStorage.getItem("auth-user");

  // Read token from cookie
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth-token="))
    ?.split("=")[1];

  // Only authenticate if BOTH user and token exist
  if (storedUser && token && token.trim() !== "") {
    setUser(JSON.parse(storedUser));
  } else {
    // If token missing → ensure user is logged out
    localStorage.removeItem("auth-user");
    setUser(null);
  }
}, []);

  // LOGIN  API 
  const login = async ({ email, password }) => {
    try {
      const res = await fetch("https://mobileappdevelopmentindia.com/elevatortoolbackend/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Invalid credentials");
      }

      // APIS return Token
      const token =  resData?.data?.Token;
      if (!token) {
        throw new Error("Token missing from API response");
      }

      const userInfo = {
        id: "admin",
        email,
      };

      // Save user
      localStorage.setItem("auth-user", JSON.stringify(userInfo));

      // FIXED cookie (SameSite so browser doesn't block it)
      document.cookie = `auth-token=${token}; path=/; SameSite=Lax`;

      setUser(userInfo);

      return true; //  (let page handle redirect)

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      throw error;
    }
  };

  const logout = async () => {
    document.cookie = "auth-token=; Max-Age=0; path=/;";
    localStorage.removeItem("auth-user");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
