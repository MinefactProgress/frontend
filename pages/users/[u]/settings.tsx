import {
  At,
  Check,
  Cross,
  EyeCheck,
  EyeOff,
  InfoCircle,
  Lock,
  Photo,
  User,
} from "tabler-icons-react";
import { Button, PasswordInput, TextInput } from "@mantine/core";

import Page from "../../../components/Page";
import { useForm } from "@mantine/form";
import useSWR from "swr";
import useUser from "../../../utils/hooks/useUser";
import { showNotification } from "@mantine/notifications";
import jwt, { sign } from "../../../utils/jwt";

const SettingsPage = () => {
  const [user, setUser] = useUser();
  const { data } = useSWR("/api/users/get/" + user.username);
  const handleSubmit = async (values: typeof form.values) => {
    const result = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/users/update?key=" + user.apikey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          uid: user.uid,
          values: {
            password: values.password != "" ? values.password : undefined,
            picture: values.picture != "" ? values.picture : undefined,
            image: values.image != "" ? values.image : undefined,
            about: values.about != "" ? values.about : undefined,
          },
        }),
      }
    );
    const data = await result.json();
    if (!data.error) {
      jwt.verify(
        data.data.user,
        "ShVmYq3t6w9z$C&E)H@McQfTjWnZr4u7",
        (err: any, decoded: any) => {
          setUser(JSON.parse(decoded.data));
          form.reset();
          showNotification({
            title: "User updated",
            message: "Data of your user has been updated",
            color: "green",
            icon: <Check />,
          });
        }
      );
    } else {
      showNotification({
        title: "Error updating user",
        message: data.message,
        color: "red",
        icon: <Cross />,
      });
    }
  };
  const form = useForm({
    initialValues: {
      picture: "",
      image: "",
      about: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: (value) =>
        value.length >= 8
          ? null
          : "Password must at least be 8 characters long",
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
      image: (value) =>
        value != ""
          ? /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*(\.png|\.jpg))/.test(
              value
            )
            ? null
            : "Only .png and .jpg are supported"
          : null,
      picture: (value) =>
        value != ""
          ? /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*(\.png|\.jpg))/.test(
              value
            )
            ? null
            : "Only .png and .jpg are supported"
          : null,
    },
  });
  return (
    <Page title="User Settings">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="About Text"
          {...form.getInputProps("about")}
          icon={<InfoCircle size={14} />}
        />
        <TextInput
          label="Profile Image"
          {...form.getInputProps("picture")}
          icon={<Photo size={14} />}
        />
        <TextInput
          label="Profile Banner"
          {...form.getInputProps("image")}
          icon={<Photo size={14} />}
        />
        <PasswordInput
          label="Password"
          {...form.getInputProps("password")}
          visibilityToggleIcon={({ reveal, size }) =>
            reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
          }
          icon={<Lock size={14} />}
        />
        <PasswordInput
          label="Confirm Password"
          {...form.getInputProps("confirmPassword")}
          visibilityToggleIcon={({ reveal, size }) =>
            reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
          }
          icon={<Lock size={14} />}
        />
        <Button
          type="submit"
          sx={(theme: any) => ({ marginTop: theme.spacing.md })}
          fullWidth
        >
          Submit Changes
        </Button>
      </form>
    </Page>
  );
};

export default SettingsPage;
