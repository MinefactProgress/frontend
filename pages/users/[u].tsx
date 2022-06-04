import { Avatar, Center, Progress, Text, Title, useMantineTheme } from "@mantine/core";

import Page from "../../components/Page";
import { progressToColorName } from "../../utils/blockUtils";
import { useRouter } from "next/router";
import useSWR from "swr";
import useUser from "../../utils/hooks/useUser";

const UserPage = () => {
  const router = useRouter();
  const theme = useMantineTheme();
  const { u } = router.query;
  const [user] = useUser();
  const { data } = useSWR(`/api/users/get/${u}`);
  const { data:rndImage } = useSWR(`/api/admin/getRandomImage`);
  var image = data?.image;
  if(!image) {
    image = rndImage?.link;
  }
  console.log(data);
  return (
    <Page noMargin style={{ position: "relative" }} title={u?.toString()}>
      <div
        style={{
          backgroundColor: "white",
          background: `url(${
            image
          }) center center / cover`,
          width: "100%",
          height: "40vh",
        }}
      ></div>
      <Center
        style={{
          width: "100%",
          height: "40vh",
          position: "absolute",
          top: 0,
          left: 0,
          background: "rgba(0,0,0,0.7)",
        }}
      >
        <Avatar size={theme.spacing.xl * 6} src={data?.picture} radius={2000}>
          {(u || [""]).toString().charAt(0)}
        </Avatar>
        <Title
          style={{
            color: "white",
            fontSize: theme.fontSizes.xl * 3,
            marginLeft: theme.spacing.xl,
            userSelect: "none",
          }}
        >
          {u}
        </Title>
      </Center>
      <Progress value={21} color={progressToColorName(data?.progress)} radius={0} styles={{root:{backgroundColor:"#00000000"}}} style={{marginTop:-theme.spacing.md/4}}/>
    </Page>
  );
};

export default UserPage;
