import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  createStyles,
} from "@mantine/core";
import useUser, { useAuth } from "../hooks/useUser";

import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundImage: "url(tribeca.webp)",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: "100vh",
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

export default function Login() {
  const { classes } = useStyles();
  const [user, setUser] = useUser();
  const auth = useAuth();
  const router = useRouter();
  const form = useForm({
    initialValues: {
      username: "",
      discord: "",
      password: "",
    },

    validate: {
      username: (value) => (value ? null : "Please enter a username."),
      discord: (value) => (value ? null : "Please enter a discord tag."),
      password: (value) => (value ? null : "Please enter a password."),
    },
  });
  const handleSubmit = async (values: typeof form.values) => {
    const result = await fetch(process.env.NEXT_PUBLIC_API_URL + "/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        username: values.username,
        discord: values.discord,
        password: values.password,
      }),
    });
    const data = await result.json();
    if (!data.error) {
      router.push(
        `/login${router.query.red ? "?red=" + router.query.red : ""}`
      );
      showNotification({
        title: "Success",
        message: data.message,
        color: "green",
      });
    } else {
      showNotification({
        title: "Error",
        message: data.error,
        color: "red",
        icon: <Login />,
      });
    }
  };
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title
          order={2}
          className={classes.title}
          align="center"
          mt="md"
          mb={50}
        >
          BTE NYC Progress
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Username"
            placeholder="Your minecraft name..."
            size="md"
            {...form.getInputProps("username")}
          />
          <TextInput
            label="Discord"
            placeholder=". . .#1234"
            size="md"
            {...form.getInputProps("discord")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" size="md" type="submit">
            Register
          </Button>
        </form>
        <Text align="center" mt="md">
          Already have an account?{" "}
          <Anchor<"a">
            href="#"
            weight={700}
            onClick={(event) =>
              router.push(
                `/login${router.query.red ? "?red=" + router.query.red : ""}`
              )
            }
          >
            Log In
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
