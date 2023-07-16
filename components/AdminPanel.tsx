import { createStyles, Container, Tabs, Title } from "@mantine/core";
import { IconBuildingCommunity, IconUsers } from "@tabler/icons";

import { Permissions } from "../util/permissions";
import useUser from "../hooks/useUser";
import { useState } from "react";
import { Users } from "./adminpanel/Users";

interface TabProps {
  name: string;
  permission?: number;
  icon?: any;
  component: any;
}

const tabs: TabProps[] = [
  {
    name: "Users",
    permission: Permissions.moderator,
    icon: <IconUsers />,
    component: <Users />,
  },
  { name: "Districts", icon: <IconBuildingCommunity />, component: null },
];

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderBottom: `${1} solid ${
      theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[2]
    }`,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },

  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  tabsList: {
    borderBottom: "0 !important",
  },

  tab: {
    fontWeight: 500,
    height: 38,
    backgroundColor: "transparent",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    },

    "&[data-active]": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      borderColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[2],
    },
  },
}));

export const AdminPanel = () => {
  const [user] = useUser();
  const { classes } = useStyles();
  const [activeTab, setActiveTab] = useState<string | null>(tabs[0].name);

  return (
    <>
      <div className={classes.header}>
        <Container className={classes.mainSection}>
          <Title>Admin Panel {`> ${activeTab}`}</Title>
        </Container>
        <Container>
          <Tabs
            defaultValue="Home"
            variant="outline"
            value={activeTab}
            onTabChange={setActiveTab}
            classNames={{
              root: classes.tabs,
              tabsList: classes.tabsList,
              tab: classes.tab,
            }}
          >
            <Tabs.List>
              {tabs
                .filter(
                  (tab) =>
                    (user?.permission || 0) >=
                    (tab.permission || Permissions.admin)
                )
                .map((tab) => (
                  <Tabs.Tab value={tab.name} key={tab.name} icon={tab.icon}>
                    {tab.name}
                  </Tabs.Tab>
                ))}
            </Tabs.List>
          </Tabs>
        </Container>
      </div>
      <div style={{ margin: "20px" }}>
        {tabs.find((tab) => tab.name === activeTab)?.component}
      </div>
    </>
  );
};
