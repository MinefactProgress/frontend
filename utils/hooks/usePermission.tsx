import useUser, { useAuth } from "./useUser";

import { useRouter } from "next/router";

export const Permissions = {
  Default: 0,
  Event: 1,
  Builder: 2,
  Moderator: 3,
  Admin: 4,
};

export function getRoleFromPermission(permission: number) {
  switch (permission) {
    case 0:
      return "User";
    case 1:
      return "Event";
    case 2:
      return "Builder";
    case 3:
      return "Moderator";
    case 4:
      return "Admin";
    default:
      return "User";
  }
}
