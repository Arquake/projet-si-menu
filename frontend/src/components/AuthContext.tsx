import React, { createContext, useContext } from 'react';
import { AuthStatus, useAuth } from '../useHook/useAuth';

const AuthContext = createContext(AuthStatus.Unknown);

interface AuthProps {
    children: React.ReactNode;
  }

export const AuthProvider = ({ children }: AuthProps) => {
  const {status} = useAuth()

  return (
    <AuthContext.Provider value={ status }>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthenticatedUser = () => useContext(AuthContext);
