import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const {
    state,
    signIn,
    signOut,
    getBasicUserInfo,
    getIDToken,
    getDecodedIDToken
  } = useAuthContext();

  useEffect(() => {
    const initAuth = async () => {
      if (state.isAuthenticated) {
        const userInfo = await getBasicUserInfo();
        setUser(userInfo);
        // You'll need to map Asgardeo groups to your roles
        // This depends on how you've configured your groups in Asgardeo
        const decodedToken = await getDecodedIDToken();
        const userGroups = decodedToken?.groups || [];
        setUserRole(mapGroupToRole(userGroups));
      }
      setLoading(false);
    };

    initAuth();
  }, [state.isAuthenticated]);

  const mapGroupToRole = (groups) => {
    // Map Asgardeo groups to your application roles
    if (groups.includes('admin')) return 'admin';
    if (groups.includes('event_manager')) return 'event_manager';
    return 'member';
  };

  return (
    <AuthContext.Provider value={{
      user,
      userRole,
      loading,
      isAuthenticated: state.isAuthenticated,
      signIn,
      signOut
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);