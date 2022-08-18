import {
  Box,
  Button,
  Center,
  createStyles,
  Group,
  Paper,
  PasswordInput,
  Progress,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { AlertTriangle, Check, Cross, X } from "tabler-icons-react";
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

function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text color={meets ? "teal" : "red"} mt={5} size="sm">
      <Center inline>
        {meets ? <Check size={14} /> : <X size={14} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}
const requirements = [
  { re: /.{8,}/, label: "Has at least 8 characters" },
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letters" },
  { re: /[A-Z]/, label: "Includes uppercase letters" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-"]/, label: "Includes special symbol" },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

const RegisterPage = () => {
  const theme = useMantineTheme();
  const [user, setUser] = useUser();
  const auth = useAuth();
  const { classes } = useStyles();
  const form = useForm({
    initialValues: {
      username: "",
      discord: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      username: (value) => (value ? null : "Please enter a username"),
      discord: (value) => (value ? null : "Please enter a discord name"),
      password: (value) =>
        value.length >= 8
          ? null
          : "Password must be at least 8 characters long",
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const strength = getStrength(form.values.password);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.values.password)}
    />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ bar: { transitionDuration: "0ms" } }}
        value={
          form.values.password.length > 0 && index === 0
            ? 100
            : strength >= ((index + 1) / 4) * 100
            ? 100
            : 0
        }
        color={strength > 80 ? "teal" : strength > 50 ? "yellow" : "red"}
        key={index}
        size={4}
      />
    ));

  const handleSubmit = async (values: typeof form.values) => {
    const result = await fetch(process.env.NEXT_PUBLIC_API_URL + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        username: values.username !== "" ? values.username : undefined,
        discord: values.discord !== "" ? values.discord : undefined,
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
          <>
            <Group>
              <AlertTriangle size={20} color="red" />
              <Text color="red" style={{ marginBottom: theme.spacing.md }}>
                Please only request an account if you are a staff member of New
                York City and don&apos;t already have one!
              </Text>
            </Group>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                required
                label="Minecraft-Username"
                placeholder="Username"
                {...form.getInputProps("username")}
              />
              <TextInput
                required
                label="Discord-Tag"
                placeholder="Name#1234"
                {...form.getInputProps("discord")}
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
              <Group spacing={5} grow mt="xs" mb="md">
                {bars}
              </Group>
              {checks}
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
          </>
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
