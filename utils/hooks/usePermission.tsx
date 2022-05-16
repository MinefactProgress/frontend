import useUser, { useAuth } from "./useUser";

import { useRouter } from "next/router";

export default function PermissionWrapper(props: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  permission?: number;
}) {
  const [user] = useUser();
  const auth = useAuth();
  const router = useRouter();
  if (
    auth && props.permission ? (user.permission || 0) <= props.permission : true
  ) {
    return <div>{props.children}</div>;
  }
  if (typeof props.fallback === "boolean") {
    router.push("/login");
    return <p>Loading</p>;
  }
  return <div>{props.fallback || null}</div>;
}

export function getRoleFromPermission(permission: number) {
  switch (permission) {
    case 0:
      return "User";
    case 1:
      return "Builder";
    case 2:
      return "Moderator";
    case 3:
      return "Admin";
    case 4:
      return "Admin";
    default:
      return "User";
  }
}
