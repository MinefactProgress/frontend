import { 
  Badge,
  Center,
  Checkbox,
  Grid, Paper,
  Progress,
  ScrollArea,
  Table,
  Text,
  Title,
  useMantineTheme
} from "@mantine/core";

import Page from "../../../components/Page";
import { useRouter } from "next/router";
import useSWR from "swr";
import { progressToColorName, statusToColorName, statusToName, colorFromStatus } from "../../../utils/blockUtils";
import Map from "../../../components/Map";

const DistrictPage = () => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { district } = router.query;
  const { data } = useSWR("http://142.44.137.53:8080/api/districts/get/"+ district)
  
  const handleClick = (blockID: any) => {
    router.push("/districts/" + district + "/" + blockID);
  }
  
  return <Page>
    <Grid>
      <Grid.Col>
        <Paper
          withBorder
          radius="md"
          p="xs"
        >
          <Title>
            {district}
          </Title>
          <Progress
            size="xl"
            value={data?.progress}
            color={progressToColorName(data?.progress)}
            label={data?.progress.toFixed(2) + "%"}
          />
        </Paper>
      </Grid.Col>
      <Grid.Col span={8}>
        <Paper
          withBorder
          radius="md"
          p="xs"
          style={{
            marginBottom: theme.spacing.md
          }}
        >
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            Blocks
          </Text>
          <ScrollArea style={{ height: "75vh" }}>
            <Table
              highlightOnHover
            >
              <thead>
                <tr>
                  <th>Block ID</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Details</th>
                  <th>Builder</th>
                  <th>Completion Date</th>
                </tr>
              </thead>
              <tbody>
                {data
                  ? data?.blocks.blocks.map((block: any) => (
                    <tr onClick={e => handleClick(block.id)}>
                      <td>{block.id}</td>
                      <td>
                        <Badge
                          color={statusToColorName(block.status)}
                        >
                          {statusToName(block.status)}
                        </Badge>
                      </td>
                      <td>
                        <Center>
                          {block.progress.toFixed(2) + "%"}
                        </Center>
                        <Progress
                          size="sm"
                          value={block.progress}
                          color={progressToColorName(block.progress)}
                        />
                      </td>
                      <td>
                        <Center>
                          <Checkbox
                            color="green"
                            checked={block.details}
                          />
                        </Center>
                      </td>
                      <td>{block.builders}</td>
                      <td>
                        {!block.completionDate ? "---"
                          : new Date(block.completionDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                : null}
              </tbody>
            </Table>
          </ScrollArea>
        </Paper>
      </Grid.Col>
      <Grid.Col span={4}>
        <Paper
          withBorder
          radius="md"
          p="xs"
          style={{
            height: "35vh",
            marginBottom: theme.spacing.md,
          }}
        >
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            Map
          </Text>
          <Map
            width="100%"
            height="94%"
            zoom={14}
            center={
              data?.center?.length > 0
                ? data?.center
                : data?.blocks.blocks[0].area[0]
            }
            polygon={{ data: data?.area || [] }}
            components={data
              ?.blocks.blocks.map((block: any) =>
                block.area.length !== 0
                  ? {
                      type: "polygon",
                      positions: block.area,
                      options: {
                        color: `${colorFromStatus(block.status)}FF`,
                        opacity: 0.1,
                      },
                      radius: 15,
                      tooltip: "Block #" + block.id,
                      eventHandlers: {
                        click: () => {
                          handleClick(block.id);
                        }
                      }
                    }
                  : null
              )
            }
          />
        </Paper>
        <Paper
          withBorder
          radius="md"
          p="xs"
          style={{
            marginBottom: theme.spacing.md,
          }}
        >
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            Top 3 Builders
          </Text>
          <Table>
            <thead>
              <tr>
                <th>Ranking</th>
                <th>Builder</th>
                <th>Claims</th>
              </tr>
            </thead>
            <tbody>
              {data
                ? data?.builders.slice(0,3).map((builder: any, index: number) => (
                  <tr>
                    <td>{index+1}</td>
                    <td>{builder.name}</td>
                    <td>{builder.blocks}</td>
                  </tr>
                ))
              : null}
            </tbody>
          </Table>
        </Paper>
      </Grid.Col>
    </Grid>
  </Page>;
};

export default DistrictPage;
