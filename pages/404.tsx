import {
  Button,
  Container,
  Group,
  Text,
  Title,
  createStyles,
} from "@mantine/core";

import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
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

    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 500,
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

function ErrorPage() {
  const { classes } = useStyles();
  const code = 404;
  const status = {
    code: 404,
    title: "We got lost searching this page.",
    message:
      "We can't find the page you're looking for. Please check the URL and try again.",
  };
  const router = useRouter();
  return (
    <Container className={classes.root}>
      <div className={classes.label}>{status.code}</div>
      <Title className={classes.title}>{status.title}</Title>
      <Text
        color="dimmed"
        size="lg"
        align="center"
        className={classes.description}
      >
        {" "}
        {status.message}
      </Text>
      <Group position="center">
        <Button variant="outline" size="md" onClick={() => router.back()}>
          Go Back
        </Button>
      </Group>
    </Container>
  );
}
export default ErrorPage;
