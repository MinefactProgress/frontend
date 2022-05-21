import useUser, { useAuth } from "./useUser";

import { useRouter } from "next/router";

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
