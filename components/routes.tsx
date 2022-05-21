import {
  BuildingCommunity,
  ChartBar,
  ChartInfographic,
  Database,
  Hierarchy,
  Link,
  List,
  Map,
  MapPins,
  Settings,
  Users
} from "tabler-icons-react";

const pages = [
  {
    icon: <ChartBar size={16} />,
    color: "yellow",
    label: "Progress Overview",
    href: "/",
    badge: "",
    permission: 1,
  },
  {
    icon: <List size={16} />,
    color: "yellow",
    label: "Project List",
    href: "/projects",
    permission: 1,
  },
  {
    icon: <BuildingCommunity size={16} />,
    color: "yellow",
    label: "Districts",
    href: "/districts",
    permission: 1,
  },
  {
    icon: <Hierarchy size={16} />,
    color: "yellow",
    label: "Network Status",
    href: "/network",
    permission: 1,
  },
  {
    icon: <Map size={16} />,
    color: "yellow",
    label: "Dynmap",
    href: "/dynmap",
    permission: 1,
  },
  // Builders
  {
    label: "Staff",
    divider: true,
    permission: 1,
  },
  {
    icon: <Link size={16} />,
    color: "lime",
    label: "Usefull Links",
    href: "/links",
    permission: 1,
  },
  {
    icon: <MapPins size={16} />,
    color: "lime",
    label: "Map Locations",
    href: "/admin/locations",
    permission: 1,
  },
  // Moderators
  {
    label: "Moderation",
    divider: true,
    permission: 3,
  },
  // Admin
  {
    label: "Administration",
    divider: true,
    permission: 3,
  },
  {
    icon: <ChartInfographic size={16} />,
    color: "grape",
    label: "Status",
    href: "/admin",
    permission: 4,
  },
  {
    icon: <Database size={16} />,
    color: "grape",
    label: "Database",
    href: "/admin/database",
    permission: 4,
  },
  {
    icon: <Users size={16} />,
    color: "grape",
    label: "Users",
    href: "/admin/users",
    permission: 2,
  },
  {
    icon: <Settings size={16} />,
    color: "grape",
    label: "Settings",
    href: "/admin/settings",
    permission: 4,
  },
];

export default pages;
