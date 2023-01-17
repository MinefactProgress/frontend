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
      password: "",
    },

    validate: {
      username: (value) => (value ? null : "Please enter a username"),
      password: (value) => (value ? null : "Please enter a password"),
    },
  });
  const handleSubmit = async (values: typeof form.values) => {
    const result = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    });
    const data = await result.json();
    if (!data.error) {
      setUser({ token: data.data.token, ...data.data.user });
      router.push(router.query.red?.toString() || "/");
    } else {
      showNotification({
        title: "Error",
        message: data.message,
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
            disabled={auth}
            label="Username"
            placeholder="Your username"
            size="md"
            {...form.getInputProps("username")}
          />
          <PasswordInput
            disabled={auth}
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" size="md" disabled={auth} type="submit">
            Login
          </Button>
        </form>
        {auth && (
          <Button
            fullWidth
            mt="xl"
            size="md"
            type="submit"
            onClick={() => {
              setUser(undefined);
            }}
          >
            Log out instead
          </Button>
        )}
        <Text align="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor<"a">
            href="#"
            weight={700}
            onClick={(event) => router.push("/register")}
          >
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
