import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { Spin } from 'antd';

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true)

  React.useEffect(() => {
    const unsubscibed = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, email, uid, photoURL } = user;
        setUser({
          displayName,
          email,
          uid,
          photoURL,
        });
        setIsLoading(false)
        navigate("/");
        return
      };
      setUser({});
      setIsLoading(false);
      navigate("/login");
    });

    //clear function
    return () => {
      unsubscibed();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{user}}>
        {isLoading ?<Spin style={{ position: 'fixed', inset: 0 }}/>: children}
    </AuthContext.Provider>
  )
}