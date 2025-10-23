
import React from 'react';
import { User } from '../types';

export interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);
