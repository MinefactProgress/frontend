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
  Users,
} from "tabler-icons-react";

const pages = [
  {
    icon: <ChartBar size={16} />,
    color: "yellow",
    label: "Progress Overview",
    href: "/",
    badge: "",
    permission: 0,
  },
  {
    icon: <BuildingCommunity size={16} />,
    color: "yellow",
    label: "Districts",
    href: "/districts",
    permission: 0,
  },
  {
    icon: <List size={16} />,
    color: "yellow",
    label: "Project List",
    href: "/projects",
    permission: 0,
  },
  {
    icon: <Users size={16} />,
    color: "yellow",
    label: "Staff Team",
    href: "/users",
    permission: 0,
  },
  {
    icon: <Hierarchy size={16} />,
    color: "yellow",
    label: "Network Status",
    href: "/network",
    permission: 0,
  },
  {
    icon: <Map size={16} />,
    color: "yellow",
    label: "Dynmap",
    href: "/dynmap",
    permission: 0,
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
    label: "Useful Links",
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
    permission: 2,
  },
  {
    icon: <BuildingSkyscraper size={16} />,
    color: "cyan",
    label: "Manage Landmarks",
    href: "/admin/landmarks",
    permission: 2,
  },
  {
    icon: <Users size={16} />,
    color: "cyan",
    label: "Users",
    href: "/admin/users",
    permission: 2,
  },
  // Admin
  {
    label: "Administration",
    divider: true,
    permission: 3,
  },
  {
    icon: <BuildingCommunity size={16} />,
    color: "grape",
    label: "Manage Districts",
    href: "/admin/districts",
    permission: 4,
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
    icon: <Settings size={16} />,
    color: "grape",
    label: "Settings",
    href: "/admin/settings",
    permission: 4,
  },
];

export default pages;
