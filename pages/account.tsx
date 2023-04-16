import { Button, PasswordInput, TextInput } from "@mantine/core";
import {
  IconCheck,
  IconEyeCheck,
  IconEyeOff,
  IconInfoCircle,
  IconLock,
  IconPhoto,
  IconUser,
} from "@tabler/icons";

import { Error } from "../components/Error";
import { Page } from "../components/Page";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import useUser from "../hooks/useUser";

const SettingsPage = () => {
  const [user, setUser] = useUser();
  const [code, setCode] = useState();
  const handleLink = () => {
    fetch(process.env.NEXT_PUBLIC_API_URL + `/v1/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user?.token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          showNotification({
            title: "Error linking account",
            message: res.error,
            color: "red",
          });
        } else {
          setCode(res?.data.data.code);
          showNotification({
            title: "Linking started",
            message:
              "Please enter /progress verify " +
              res?.data.data.code +
              " in the minecraft chat.",
            color: "green",
            icon: <IconCheck />,
          });
        }
      });
  };

  if (!user) return <Error error={404} />;
  return (
    <Page name="User Settings" icon={<IconUser />}>
      <p>{code && "/progress verify " + code}</p>
      <Button onClick={handleLink}>Link Minecraft Account</Button>
    </Page>
  );
};

export default SettingsPage;
