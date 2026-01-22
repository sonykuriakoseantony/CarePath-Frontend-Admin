import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

/* ----------------------------------------
   Role → Permission Mapping
---------------------------------------- */
const ROLE_PERMISSIONS = {
  admin: [
    "view_dashboard",
    "manage_departments",
    "manage_doctors",
    "manage_rules",
    "view_all_symptoms",
    "manage_users",
    "configure_settings",
    "view_symptoms",
    "run_matching",
    "approve_symptoms",
    "add_notes",
  ],
  review_specialist: [
    "view_symptoms",
    "run_matching",
    "approve_symptoms",
    "add_notes",
  ],
};

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [role, setRole] = useState('');
  const [authorisedUSer, setAuthorisedUser] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const stored = sessionStorage.getItem('user');
    if (token && stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setRole(parsed.role || '');
      setAuthorisedUser(true);
    } else {
      setUser(null);
      setRole('');
      setAuthorisedUser(false);
    }
  }, [])


  /* ---------- Permissions ---------- */


  const hasPermission = useCallback(
    (permission) => {
      if (!user) return false;
      return (
        ROLE_PERMISSIONS[user.role]?.includes(
          permission
        ) ?? false
      );
    },
    [user]
  );

  const logout = useCallback(() => {
    setUser(null);
    setRole('');
    setAuthorisedUser(false);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  }, []);



  return (
    <>
      <AuthContext.Provider value={{user, setUser, isAuthenticated : !!user, role, logout, authorisedUSer, setAuthorisedUser, hasPermission }} >
        {children}
      </AuthContext.Provider>

    </>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }
  return context;
}
