"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getProfile } from "@/actions/user-actions";
import { useSession } from "next-auth/react";

interface ProfileSchema {
  name: string;
  role: string;
  avatar: string;
}

interface ProfileContextType {
  profile: ProfileSchema;
  fetchProfile: (userId: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileSchema>({
    name: "",
    role: "",
    avatar: "",
  });

  const fetchProfile = async (userId: string) => {
    try {
      const result = await getProfile(userId);
      if (result) {
        setProfile(result);
      } else {
        console.error("Error al traer el perfil:");
      }
    } catch (error) {
      console.error("Error al traer el perfil: " + error);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchProfile(session.user.id);
  }, [session?.user?.id]);

  return (
    <ProfileContext.Provider value={{ profile, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile debe usarse dentro de un ProfileProvider");
  }
  return context;
};