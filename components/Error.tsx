import {
  Button,
  Center,
  Container,
  Group,
  Text,
  Title,
  createStyles,
  useMantineTheme,
} from "@mantine/core";

import toText from "error-to-text";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 120,
    height: "100vh",
  },

  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    userSelect: "none",
    marginBottom: theme.spacing.xl * 1.5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],

    [theme.fn.smallerThan("sm")]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: 38,
    color: theme.white,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 540,
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

export function Error(props: { error: number }) {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const error = toText(props.error);
  const router = useRouter();
  return (
    <div className={classes.root}>
      <Center style={{ height: "100%" }}>
        <Container>
          <div className={classes.label}>{error?.code}</div>
          <Title className={classes.title}>{error?.title}</Title>
          <Text size="lg" align="center" className={classes.description}>
            {error?.description}
          </Text>
          <Group position="center">
            <Button size="md" onClick={() => router.back()}>
              Back
            </Button>
          </Group>
        </Container>
      </Center>
    </div>
  );
}
