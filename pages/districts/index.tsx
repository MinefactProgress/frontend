import {
  Accordion,
  Badge,
  Center,
  Grid,
  MediaQuery,
  Paper,
  Progress,
  ScrollArea,
  Table,
  Text,
} from "@mantine/core";
import {
  progressToColorName,
  statusToColorName,
  statusToName,
} from "../../utils/blockUtils";

import { Building } from "tabler-icons-react";
import Page from "../../components/Page";
import { useRouter } from "next/router";
import useSWR from "swr";

const DistrictsPage = () => {
  const router = useRouter();
  const { data } = useSWR("/api/districts/get");
  const nyc = useSWR("/api/progress").data;
  const nycID = data?.filter((d: any) => d.name === "New York City")[0].id;
  const boroughs = data
    ?.filter((d: any) => d.parent === null)
    .concat(
      data?.filter((d: any) => d.parent === nycID).sort(dynamicSort("progress"))
    );

  const handleOpenDistrict = (id: string) => {
    router.push("/districts/" + id);
  };

  const genDistricts = (parent: any, data: any) => {
    data.sort(dynamicSort("progress"));
    const districts = [parent].concat(data);
    return (
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
              <th>Status</th>
            </MediaQuery>
            <th>Progress</th>
            <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
              
              <th>Blocks Done</th>
            
              </MediaQuery><MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
              <th>Blocks Left</th>
              </MediaQuery><MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
            <th>Completion Date</th></MediaQuery>
          </tr>
        </thead>
        <tbody>
          {districts?.map((district: any, i: number) => (
            <tr
              onClick={(e) => {
                if (district.name !== parent.name) {
                  handleOpenDistrict(district.name);
                }
              }}
              key={i}
            >
              <td>{district.name}</td>
              <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                <td>
                  <Badge color={statusToColorName(district.status)}>
                    {statusToName(district.status)}
                  </Badge>
                </td>
              </MediaQuery>
              <td>
                <Center>{district.progress.toFixed(2) + "%"}</Center>
                <Progress
                  size="sm"
                  value={district.progress}
                  color={progressToColorName(district.progress)}
                />
              </td>
              <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                <td>{district.blocksCount.done}</td>
              </MediaQuery><MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                <td>
                  {district.blocksCount.total - district.blocksCount.done}
                </td>
              </MediaQuery><MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
              <td>
                {!district.completionDate
                  ? "---"
                  : new Date(district.completionDate).toLocaleDateString()}
              </td></MediaQuery>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };
  const genSubboroughs = (data: any) => {
    data.sort(dynamicSort("progress"));
    return data?.map((child: any, i: number) => {
      return (
        <Accordion.Item label={child.name} key={i}>
          {genDistricts(child, child.children)}
        </Accordion.Item>
      );
    });
  };
  const genBoroughs = () => {
    nyc?.children.sort(dynamicSort("progress"));
    return nyc?.children.map((child: any, i: number) => {
      return (
        <Grid.Col key={i}>
          <Paper withBorder radius="md" p="xs">
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              {child.name}
            </Text>
            <Accordion>{genSubboroughs(child.children)}</Accordion>
          </Paper>
        </Grid.Col>
      );
    });
  };

  return (
    <Page title="Districts">
      <Grid>
        <Grid.Col>
          <Paper withBorder radius="md" p="xs">
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Boroughs
            </Text>
            <Table>
              <thead>
                <tr>
                <th>Name</th>
            <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
              <th>Status</th>
            </MediaQuery>
            <th>Progress</th>
            <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
              
              <th>Blocks Done</th>
            
              </MediaQuery><MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
              <th>Blocks Left</th>
              </MediaQuery><MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
            <th>Completion Date</th></MediaQuery>
                </tr>
              </thead>
              <tbody>
                {boroughs
                  ? boroughs?.map((district: any) => (
                      <tr key={district.name}>
                        <td>{district.name}</td>
            <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                        <td>
                          <Badge color={statusToColorName(district.status)}>
                            {statusToName(district.status)}
                          </Badge>
                        </td>
            </MediaQuery>
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
              </MediaQuery><MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                        <td>{district.blocks.left}</td>
              </MediaQuery><MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
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

export default DistrictsPage;
