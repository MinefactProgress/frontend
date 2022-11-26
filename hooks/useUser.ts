import React from "react";
import { useLocalStorage } from "@mantine/hooks";
import { useRouter } from "next/router";

export interface UserData {
  uid?: number;
  email?: string;
  username?: string;
  permission?: number;
  discord?: string;
  minecraft?: string;
  about?: string;
  image?: string;
  picture?: string;
  settings?: string;
  password?: string;
  token?: string;
}

export default function useUser() {
  return useLocalStorage<UserData | undefined | null>({
    key: "auth",
    defaultValue: undefined,
    getInitialValueInEffect: true,
  });
}

export function useAuth() {
  const [user] = useUser();
  return user?.token ? true : false;
}
