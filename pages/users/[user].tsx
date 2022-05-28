import { Text } from "@mantine/core";

import Page from "../../components/Page";
import { useRouter } from "next/router";

const UserPage = () => {
  const router = useRouter();
  const { user } = router.query;
  return (
    <Page>
      <Text>{user}</Text>
    </Page>
  );
};

export default UserPage;
