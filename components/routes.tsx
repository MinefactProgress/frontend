import {
  BuildingCommunity,
  BuildingSkyscraper,
  ChartBar,
  ChartInfographic,
  Database,
  Hierarchy,
  Link,
  List,
  Map,
  MapPins,
  Settings,
  UserPlus,
  Users,
} from "tabler-icons-react";
import { Permissions } from "../utils/hooks/usePermission";

const pages = [
  {
    icon: <ChartBar size={16} />,
    color: "yellow",
    label: "Progress Overview",
    href: "/",
    badge: "",
    permission: Permissions.Default,
  },
  {
    icon: <BuildingCommunity size={16} />,
    color: "yellow",
    label: "Districts",
    href: "/districts",
    permission: Permissions.Default,
  },
  {
    icon: <List size={16} />,
    color: "yellow",
    label: "Project List",
    href: "/projects",
    permission: Permissions.Default,
  },
  {
    icon: <Users size={16} />,
    color: "yellow",
    label: "Staff Team",
    href: "/users",
    permission: Permissions.Default,
  },
  {
    icon: <Hierarchy size={16} />,
    color: "yellow",
    label: "Network Status",
    href: "/network",
    permission: Permissions.Default,
  },
  {
    icon: <Map size={16} />,
    color: "yellow",
    label: "Dynmap",
    href: "/dynmap",
    permission: Permissions.Default,
  },
  // Builders
  {
    label: "Staff",
    divider: true,
    permission: Permissions.Builder,
  },
  {
    icon: <UserPlus size={16} />,
    color: "lime",
    label: "Claim Landmarks",
    href: "/landmarks",
    permission: Permissions.Builder,
  },
  {
    icon: <Link size={16} />,
    color: "lime",
    label: "Useful Links",
    href: "/links",
    permission: Permissions.Builder,
  },
  {
    icon: <MapPins size={16} />,
    color: "lime",
    label: "Map Locations",
    href: "/admin/locations",
    permission: Permissions.Builder,
  },
  // Moderators
  {
    label: "Moderation",
    divider: true,
    permission: Permissions.Moderator,
  },
  {
    icon: <BuildingSkyscraper size={16} />,
    color: "cyan",
    label: "Manage Landmarks",
    href: "/admin/landmarks",
    permission: Permissions.Moderator,
  },
  {
    icon: <Users size={16} />,
    color: "cyan",
    label: "Users",
    href: "/admin/users",
    permission: Permissions.Moderator,
  },
  // Admin
  {
    label: "Administration",
    divider: true,
    permission: Permissions.Moderator,
  },
  {
    icon: <BuildingCommunity size={16} />,
    color: "grape",
    label: "Manage Districts",
    href: "/admin/districts",
    permission: Permissions.Moderator,
  },
  {
    icon: <ChartInfographic size={16} />,
    color: "grape",
    label: "Status",
    href: "/admin",
    permission: Permissions.Admin,
  },
  {
    icon: <Database size={16} />,
    color: "grape",
    label: "Database",
    href: "/admin/database",
    permission: Permissions.Admin,
  },
  {
    icon: <Settings size={16} />,
    color: "grape",
    label: "Settings",
    href: "/admin/settings",
    permission: Permissions.Admin,
  },
];

export default pages;
