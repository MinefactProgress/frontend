import { NextPage } from "next";
import {
  createStyles,
  Anchor,
  Breadcrumbs,
  Container,
  Tabs,
  Title,
} from "@mantine/core";
import { Page } from "../../../components/Page";
import { IconBuildingCommunity, IconTool, IconUsers } from "@tabler/icons";
import { Permissions } from "../../../util/permissions";
import { Users } from "../../../components/adminpanel/Users";
import useUser from "../../../hooks/useUser";
import { useRouter } from "next/router";

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

const AdminPage: NextPage = ({}: any) => {
  const router = useRouter();
  const [user] = useUser();
  const { classes } = useStyles();
  const { section } = router.query;
  const activeTab = tabs.find(
    (tab) =>
      tab.name.toLowerCase() === (Array.isArray(section) ? section[0] : section)
  );

  const breadcrumbs = [
    { title: "Dashboard", href: "#" },
    { title: activeTab?.name, href: "#" },
  ].map((item, index) => (
    <Anchor key={index} href={item.href}>
      {item.title}
    </Anchor>
  ));

  return (
    <Page name="Admin Panel" icon={<IconTool />} noMargin>
      <div className={classes.header}>
        <Container className={classes.mainSection}>
          <Title>Admin Panel</Title>
          <Breadcrumbs separator="→">{breadcrumbs}</Breadcrumbs>
        </Container>
        <Container>
          <Tabs
            defaultValue="Home"
            variant="outline"
            value={activeTab?.name}
            onTabChange={(value) =>
              router.push(`/admin/dashboard/${value?.toLowerCase()}`)
            }
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
      <div>
        {activeTab && (
          <div style={{ margin: "20px" }}>{activeTab.component}</div>
        )}
      </div>
    </Page>
  );
};

export default AdminPage;
