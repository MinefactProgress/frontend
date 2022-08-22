import { ActionIcon, Anchor, Group, createStyles } from "@mantine/core";
import {
  BrandDiscord,
  BrandInstagram,
  BrandTwitter,
  BrandYoutube,
} from "tabler-icons-react";

import React from "react";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: theme.spacing.md,
    height: 71,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
  },
}));

interface FooterCenteredProps {
  links: { link: string; label: string }[];
}

export default function Footer({ links }: FooterCenteredProps) {
  const { classes } = useStyles();
  const items = links.map((link) => (
    <Anchor<"a">
      color="dimmed"
      key={link.label}
      href={link.link}
      sx={{ lineHeight: 1 }}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Anchor<"a">
          color="dimmed"
          href={"https://github.com/MinefactProgress"}
          target="_blank"
          sx={{ lineHeight: 1 }}
          onClick={(event) => event.preventDefault()}
          size="sm"
        >
          Copyright © {new Date().getFullYear()} BTE NYC Progress
        </Anchor>
        <Group className={classes.links}>{items}</Group>

        <Group spacing={0} position="right" noWrap>
          <ActionIcon
            size="lg"
            onClick={() => {
              window.open("https://discord.gg/nMJMMBR", "_blank");
            }}
          >
            <BrandDiscord size={18} />
          </ActionIcon>
          <ActionIcon
            size="lg"
            onClick={() => {
              window.open("https://www.youtube.com/c/MineFactYT", "_blank");
            }}
          >
            <BrandYoutube size={18} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}
