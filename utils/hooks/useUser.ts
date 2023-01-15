import { useLocalStorage } from "@mantine/hooks";

export interface UserData {
  uid: number;
  username?: string;
  uuid?: string;
  permission?: number;
  discord?: string;
  about?: string;
  image?: string;
  picture?: string;
  settings?: string;
  online?: boolean;
  last_online?: Date;
  password?: string;
  apikey?: string;
}

export default function useUser() {
  return useLocalStorage<UserData>({
    key: "auth",
    defaultValue: { uid: 0 },
    getInitialValueInEffect: true,
  });
}

export function useAuth() {
  const [user] = useUser();
  return user.uid != 0;
}
