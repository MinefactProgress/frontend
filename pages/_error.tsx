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
const errors = [
  {
    code: 300,
    title: "Too many options to choose from.",
    message:
      "You requested a page that has too many options to choose from. Pleas try again with a different page.",
  },
  {
    code: 301,
    title: "This page moved out of the 🏠.",
    message:
      "The page you requested has been permanently moved to a different URL. Please try again with the new URL.",
  },
  {
    code: 400,
    title: "Your Browser forgot to send us a 🍪.",
    message:
      "Please reload the page and check for a working internet connection.",
  },
  {
    code: 401,
    title: "Checked all of your 💳's and couldn't find the right one.",
    message:
      "You are not allowed to access this page, there isnt much to see here either.",
  },
  {
    code: 403,
    title: "Don't try to spy on us...",
    message:
      "You are not allowed to access this page, there isnt much to see here either.",
  },
  {
    code: 404,
    title: "We got lost searching this page.",
    message:
      "We can't find the page you're looking for. Please check the URL and try again.",
  },
  {
    code: 405,
    title: "Seems like your browser wants something different",
    message:
      "The method used to access this page is not allowed. Please try again with a GET method.",
  },
  {
    code: 408,
    title: "Is the 🕐 running backwards?",
    message:
      "The page you are looking for is taking too long to load. Please try again later.",
  },
  {
    code: 418,
    title: "We got you a 🫖.",
    message: "Please get comfortable with the 🫖 and try again.",
  },
  {
    code: 429,
    title: "No need to 🏃.",
    message:
      "You are trying to access this page too often. Please try again later.",
  },
  {
    code: 500,
    title: "Our server decided to go get a 🥪.",
    message:
      "We're having some issues with our server, please try again later.",
  },
  {
    code: 501,
    title: "Are you browsing on a 🪨?",
    message:
      "Your browser does not support features our website requires. Please update your browser.",
  },
  {
    code: 502,
    title: "Its pretty 🌡️ in here.",
    message:
      "Our servers are overloaded at the given time, please try again later.",
  },
  {
    code: 503,
    title: "Too many people 🏄 here.",
    message:
      "Our servers are overloaded at the given time, please try again later.",
  },
  {
    code: 508,
    title: "Getting 💫 over time.",
    message: "We detected a loop. Please try again later.",
  },
];

function ErrorPage(props: any) {
  const { classes } = useStyles();
  const code = props.code || props.statuscode;
  const status = errors.find((e) => e.code === code) || {
    code: code,
    title: "You found a Error we dont even know of!",
    message: "Something went wrong, please try again later and contact us.",
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
export function getServerSideProps({ res, err }: any) {
  if (new Date().getDate() === 1 && new Date().getMonth() === 4) {
    res.statusCode = 418;
  }

  return {
    props: {
      code: res.statusCode,
    },
  };
}
export default ErrorPage;
