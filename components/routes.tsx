import {
  ChartBar,
  ChartInfographic,
  Database,
  Hierarchy,
  List,
  Settings,
  Users
} from "tabler-icons-react";

const pages = [
  {
    icon: <ChartBar size={16} />,
    color: "blue",
    label: "Progress Overview",
    href: "/",
    badge: "",
    permission: 1,
  },
  {
    icon: <List size={16} />,
    color: "teal",
    label: "Project List",
    href: "/projects",
    permission: 1,
  },
  {
    icon: <Hierarchy size={16} />,
    color: "violet",
    label: "Network Status",
    href: "/network",
    permission: 1,
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
