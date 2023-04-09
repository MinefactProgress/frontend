import {
  Accordion,
  Badge,
  Center,
  Grid,
  LoadingOverlay,
  MediaQuery,
  Paper,
  Progress,
  ScrollArea,
  Skeleton,
  Table,
  Text,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import {
  progressToColorName,
  statusToColorName,
  statusToName,
} from "../../util/block";

import { IconBuildingCommunity } from "@tabler/icons";
import type { NextPage } from "next";
import { Page } from "../../components/Page";
import { useRouter } from "next/router";
import useSWR from "swr";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",
    zIndex: 2,
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));
const Districts: NextPage = ({}: any) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const { data } = useSWR("/v1/districts");
  data?.sort(dynamicSort("progress"));
  console.log(data);
  const nyc = data?.at(0);
  const nycID = 1;
  const boroughs = data
    ?.filter((d: any) => d.parent === null)
    .concat(
      data?.filter((d: any) => d.parent === nycID).sort(dynamicSort("progress"))
    );
  const genDistricts = (parent: any) => {
    const districts = data.filter((d: any) => d.parent == parent.id);
    return districts?.map((district: any, i: number) => (
      <tr
        onClick={(e) => {
          router.push("/districts/" + district.id);
        }}
        key={`d${district.id}-${i}`}
      >
        <td>{district.name}</td>
        <td>
          <Badge color={statusToColorName(district.status)}>
            {statusToName(district.status)}
          </Badge>
        </td>
        <td>
          <Center>{district.progress.toFixed(2) + "%"}</Center>
          <Progress
            size="sm"
            value={district.progress}
            color={progressToColorName(district.progress)}
          />
        </td>
        <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
          <td>{district.blocks.done}</td>
        </MediaQuery>
        <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
          <td>{district.blocks.total - district.blocks.done}</td>
        </MediaQuery>
        <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
          <td>
            {!district.completionDate
              ? "---"
              : new Date(district.completionDate).toLocaleDateString()}
          </td>
        </MediaQuery>
      </tr>
    ));
  };
  const genSubboroughs = (parent: any) => {
    return data
      ?.filter((d: any) => d.parent == parent.id)
      ?.map((child: any, i: number) => {
        return genDistricts(child);
      });
  };
  const genBoroughs = () => {
    return data
      ?.filter((d: any) => d.parent == 1)
      .map((child: any, i: number) => {
        return (
          <Grid.Col key={i} id={`b${i}`}>
            <Paper withBorder radius="md" p="xs">
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                {child.name}
              </Text>
              <ScrollArea sx={{ height: 400 }}>
                <Table highlightOnHover>
                  <thead className={classes.header}>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <MediaQuery
                        smallerThan={"sm"}
                        styles={{ display: "none" }}
                      >
                        <th>Blocks Done</th>
                      </MediaQuery>
                      <MediaQuery
                        smallerThan={"sm"}
                        styles={{ display: "none" }}
                      >
                        <th>Blocks Left</th>
                      </MediaQuery>
                      <MediaQuery
                        smallerThan={"sm"}
                        styles={{ display: "none" }}
                      >
                        <th>Completion Date</th>
                      </MediaQuery>
                    </tr>
                  </thead>
                  <tbody>{genSubboroughs(child)}</tbody>
                </Table>
              </ScrollArea>
            </Paper>
          </Grid.Col>
        );
      });
  };

  return (
    <Page name="Districts" icon={<IconBuildingCommunity />}>
      <LoadingOverlay visible={!(boroughs && data)} />
      <Grid>
        <Grid.Col>
          <Paper withBorder radius="md" p="xs">
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Boroughs
            </Text>
            <Table highlightOnHover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                    <th>Blocks Done</th>
                  </MediaQuery>
                  <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                    <th>Blocks Left</th>
                  </MediaQuery>
                  <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                    <th>Completion Date</th>
                  </MediaQuery>
                </tr>
              </thead>
              <tbody>
                {boroughs
                  ? boroughs?.map((district: any) => (
                      <tr
                        key={district.name}
                        onClick={(e) => {
                          router.push("/districts/" + district.id);
                        }}
                      >
                        <td>{district.name}</td>
                        <td>
                          <Badge color={statusToColorName(district.status)}>
                            {statusToName(district.status)}
                          </Badge>
                        </td>
                        <td>
                          <Center>{district.progress.toFixed(2) + "%"}</Center>
                          <Progress
                            size="sm"
                            value={district.progress}
                            color={progressToColorName(district.progress)}
                          />
                        </td>
                        <MediaQuery
                          smallerThan={"sm"}
                          styles={{ display: "none" }}
                        >
                          <td>{district.blocks.done}</td>
                        </MediaQuery>
                        <MediaQuery
                          smallerThan={"sm"}
                          styles={{ display: "none" }}
                        >
                          <td>{district.blocks.left}</td>
                        </MediaQuery>
                        <MediaQuery
                          smallerThan={"sm"}
                          styles={{ display: "none" }}
                        >
                          <td>{district.completionDate || "---"}</td>
                        </MediaQuery>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>
          </Paper>
        </Grid.Col>
        {genBoroughs()}
      </Grid>
    </Page>
  );
};

function dynamicSort(property: string) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a: any, b: any) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] > b[property] ? -1 : a[property] < b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

export default Districts;
