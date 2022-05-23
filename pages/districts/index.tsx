import {
  Accordion,
  ActionIcon,
  Badge,
  Center,
  Grid,
  Group,
  Paper,
  Progress,
  Slider,
  Table,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";

import Page from "../../components/Page";
import { useRouter } from "next/router";
import useSWR from "swr";
import { statusToName, statusToColorName, progressToColorName } from "../../utils/blockUtils";
import { Building } from "tabler-icons-react";

const DistrictsPage = () => {
    const router = useRouter();
    const { data } = useSWR("http://142.44.137.53:8080/api/districts/get");
    const nyc = useSWR("http://142.44.137.53:8080/api/progress").data;
    const nycID = data?.filter((d: any) => d.name === "New York City")[0].id;
    const boroughs =
              data?.filter((d: any) => d.parent === null).concat(data?.filter((d: any) => d.parent === nycID).sort(dynamicSort("progress")));

    const handleOpenDistrict = (id: string) => {
        router.push("/districts/" + id);
    }

    const genDistricts = (parent: any, data: any) => {
      data.sort(dynamicSort("progress"));
      const districts = [parent].concat(data);
        return <Table
          highlightOnHover
        >
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Blocks Done</th>
                <th>Blocks Left</th>
                <th>Completion Date</th>
              </tr>
            </thead>
            <tbody>
              {districts?.map((district: any) => (
                <tr onClick={e => {
                  if(district.name !== parent.name) {
                    handleOpenDistrict(district.name)
                  }
                }}>
                  <td>{district.name}</td>
                  <td>
                    <Badge
                      color={statusToColorName(district.status)}
                    >
                      {statusToName(district.status)}
                    </Badge>
                  </td>
                  <td>
                    <Center>
                      {district.progress.toFixed(2) + "%"}
                    </Center>
                    <Progress
                      size="sm"
                      value={district.progress}
                      color={progressToColorName(district.progress)}
                    />
                  </td>
                  <td>{district.blocksCount.done}</td>
                  <td>{district.blocksCount.total-district.blocksCount.done}</td>
                  <td>{!district.completionDate ? "---"
                        : new Date(district.completionDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
        </Table>
    }
    const genSubboroughs = (data: any) => {
      data.sort(dynamicSort("progress"));
        return data?.map((child: any) => {
            return <Accordion.Item label={child.name}>
                {genDistricts(child, child.children)}
            </Accordion.Item>
        })
    }
    const genBoroughs = () => {
      nyc?.children.sort(dynamicSort("progress"));
        return nyc?.children.map((child: any) => {
            return <Grid.Col>
                  <Paper
                    withBorder
                    radius="md"
                    p="xs"
                  >
                    <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                      {child.name}
                    </Text>
                    <Accordion>
                      {genSubboroughs(child.children)}
                    </Accordion>
                  </Paper>
                </Grid.Col>;
        })
    }

    return (
      <Page>
        <Grid>
          <Grid.Col>
            <Paper
              withBorder
              radius="md"
              p="xs"
            >
              <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                Boroughs
              </Text>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Blocks Done</th>
                    <th>Blocks Left</th>
                    <th>Completion Date</th>
                  </tr>
                </thead>
                <tbody>
                    {boroughs
                      ? boroughs?.map((district: any) => (
                        <tr key={district.name}>
                          <td>{district.name}</td>
                          <td>
                            <Badge
                              color={statusToColorName(district.status)}
                            >
                              {statusToName(district.status)}
                            </Badge>
                          </td>
                          <td>
                          <Center>
                            {district.progress.toFixed(2) + "%"}
                          </Center>
                          <Progress
                            size="sm"
                            value={district.progress}
                            color={progressToColorName(district.progress)}
                          />
                          </td>
                          <td>{district.blocks.done}</td>
                          <td>{district.blocks.left}</td>
                          <td>{district.completionDate || "---"}</td>
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
    )
}

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