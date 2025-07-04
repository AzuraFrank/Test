import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, ADMIN_CONFIG } from "../config/supabase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session with error handling
    const initAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.warn("Auth session error:", error);
        }
        setUser(session?.user ?? null);
        checkAdminStatus(session?.user);
      } catch (error) {
        console.warn("Auth initialization failed:", error);
        // Continue without auth
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes with error handling
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null);
        checkAdminStatus(session?.user);
        setLoading(false);
      });

      return () => subscription?.unsubscribe();
    } catch (error) {
      console.warn("Auth listener setup failed:", error);
      setLoading(false);
    }
  }, []);

  const checkAdminStatus = (user) => {
    if (user && user.email === ADMIN_CONFIG.ADMIN_EMAIL) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Google sign in failed:", error);
      throw new Error("Login dengan Gmail gagal. Silakan coba lagi.");
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Email sign in failed:", error);
      throw new Error("Login gagal. Periksa email dan password Anda.");
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Sign up failed:", error);
      throw new Error("Pendaftaran gagal. Silakan coba lagi.");
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Sign out failed:", error);
      throw new Error("Logout gagal. Silakan coba lagi.");
    }
  };

  const updateProfile = async (updates) => {
    const { error } = await supabase.auth.updateUser({
      data: updates,
    });

    if (error) throw error;
  };

  const value = {
    user,
    isAdmin,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
