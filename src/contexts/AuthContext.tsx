import React, { createContext, useContext, useState } from "react";

interface User {
  id: string;
  name: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, otp: string) => Promise<boolean>;
  loginWithUAEPass: () => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (phone: string, otp: string): Promise<boolean> => {
    // Simulate API call
    if (phone === "+971501234567" && otp === "123456") {
      setUser({
        id: "1",
        name: "Ahmed Al Mansouri",
        phone: phone,
      });
      return true;
    }
    return false;
  };

  const loginWithUAEPass = async (): Promise<boolean> => {
    // Simulate UAE Pass login
    setUser({
      id: "1",
      name: "Ahmed Al Mansouri",
      phone: "+971501234567",
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...updates,
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithUAEPass,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};