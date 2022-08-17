import {
  Button,
  createStyles,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { Check, Cross } from "tabler-icons-react";
import useUser, { useAuth } from "../utils/hooks/useUser";
import { sign } from "../utils/jwt";

const useStyles = createStyles((theme) => ({
  wrapper: {
    height: "100vh",
    backgroundSize: "cover",
    backgroundImage: `url("https://cdn.discordapp.com/attachments/714797791913705472/927491066653970442/Bridge_1.png")`,
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    height: "100vh",
    maxWidth: 550,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontSize: "2.5rem",
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const RegisterPage = () => {
  const [user, setUser] = useUser();
  const auth = useAuth();
  const { classes } = useStyles();
  const router = useRouter();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      username: (value) => (value ? null : "Please enter a username"),
      password: (value) =>
        value.length >= 8
          ? null
          : "Password must be at least 8 characters long",
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const result = await fetch(process.env.NEXT_PUBLIC_API_URL + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        username: values.username !== "" ? values.username : undefined,
        password: values.password !== "" ? sign(values.password) : undefined,
      }),
    });
    const data = await result.json();
    if (!data.error) {
      showNotification({
        title: "Account Requested",
        message:
          "Account requested successfully. Please wait until we enabled your account.",
        color: "green",
        icon: <Check />,
      });
      form.reset();
    } else {
      showNotification({
        title: "Account Request failed",
        message: data.message,
        color: "red",
        icon: <Cross />,
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
          Minefact Progress
        </Title>
        {!auth ? (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              required
              label="Minecraft-Username"
              placeholder="Username"
              {...form.getInputProps("username")}
            />
            <PasswordInput
              required
              label="Password"
              placeholder="••••••••"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              required
              label="Confirm Password"
              placeholder="••••••••"
              {...form.getInputProps("confirmPassword")}
            />
            <Button
              fullWidth
              mt="xl"
              size="md"
              type="submit"
              color={auth ? "gray" : "primary"}
            >
              Submit
            </Button>
          </form>
        ) : (
          <Text>You are already logged in!</Text>
        )}

        {auth && (
          <Button
            fullWidth
            mt="xl"
            size="md"
            type="submit"
            onClick={() => {
              setUser({ uid: 0 });
            }}
          >
            Log out instead
          </Button>
        )}
      </Paper>
    </div>
  );
};

export default RegisterPage;
