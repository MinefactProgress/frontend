import {
  Button,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  createStyles
} from "@mantine/core";
import useUser, { useAuth } from "../utils/hooks/useUser";

import jwt from "../utils/jwt";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  wrapper: {
    height: "100vh",
    backgroundSize: "cover",
    backgroundImage:
      // TODO: add Random api url
      `url("https://cdn.discordapp.com/attachments/714797791913705472/927491066653970442/Bridge_1.png")`,
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

const Login = () => {
  const [user, setUser] = useUser();
  const auth = useAuth();
  const { classes } = useStyles();
  const router = useRouter();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      username: (value) => (value ? null : "Please enter a password"),
      password: (value) => (value ? null : "Please enter a password"),
    },
  });
  const handleSubmit = async (values: typeof form.values) => {
    console.log(values);
    const result = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    });
    const data = await result.json();
    if (!data.error) {
      jwt.verify(
        data.data.user,
        "ShVmYq3t6w9z$C&E)H@McQfTjWnZr4u7",
        (err: any, decoded: any) => {
          setUser(JSON.parse(decoded.data));
          router.push("/");
        }
      );
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
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            required
            label="Username"
            placeholder="Username"
            {...form.getInputProps("username")}
          />
          <PasswordInput
            required
            label="Password"
            placeholder="••••••••"
            {...form.getInputProps("password")}
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

export default Login;
