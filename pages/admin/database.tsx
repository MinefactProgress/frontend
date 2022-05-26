import {
  Button,
  Grid,
  Paper,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Text,
  Textarea,
  useMantineTheme,
} from "@mantine/core";

import Page from "../../components/Page";
import SyntaxHighlighter from "react-syntax-highlighter";
import { androidstudio } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import useSWR from "swr";
import { useState } from "react";
import useUser from "../../utils/hooks/useUser";

const DatabasePage = () => {
  const PRIMARY_COL_HEIGHT = 840;
  const theme = useMantineTheme();
  const [user] = useUser();
  const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;
  const [sqlState, setSqlState] = useState("");
  const [fetch, setShouldFetch] = useState(false);
  const { data } = useSWR(
    fetch ? "http://142.44.137.53:8080/api/admin/query?query=" + sqlState : null
  );

  return (
    <Page>
      <SimpleGrid
        cols={2}
        spacing="md"
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
      >
        <Skeleton
          height={PRIMARY_COL_HEIGHT}
          radius="md"
          animate={false}
          visible={false}
        >
          <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Result
            </Text>
            <SyntaxHighlighter
              language="json"
              style={androidstudio}
              customStyle={{
                height: "95%",
                border: "1px solid " + theme.colors.gray[8],
                borderRadius: theme.radius.md,
              }}
              showLineNumbers
            >
              {JSON.stringify(
                data?.error ? data?.error : data?.result,
                null,
                2
              )}
            </SyntaxHighlighter>
          </Paper>
        </Skeleton>
        <Grid gutter="md">
          <Grid.Col>
            <Skeleton
              height={SECONDARY_COL_HEIGHT * 1.5}
              radius="md"
              animate={false}
              visible={false}
            >
              <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
                <Text
                  color="dimmed"
                  size="xs"
                  transform="uppercase"
                  weight={700}
                >
                  SQL Query
                </Text>
                <SyntaxHighlighter
                  language="sql"
                  style={androidstudio}
                  customStyle={{
                    height: "71%",
                    border: "1px solid " + theme.colors.gray[8],
                    borderRadius: theme.radius.md,
                  }}
                >
                  {sqlState}
                </SyntaxHighlighter>
                <Textarea
                  value={sqlState}
                  placeholder="Enter SQL query"
                  onChange={(event) => {
                    setShouldFetch(false);
                    setSqlState(event.currentTarget.value);
                  }}
                ></Textarea>
                <Button
                  onClick={() => {
                    setShouldFetch(true);
                  }}
                  fullWidth
                  sx={{ marginTop: theme.spacing.md }}
                >
                  Submit
                </Button>
              </Paper>
            </Skeleton>
          </Grid.Col>
          <Grid.Col span={6}>
            <Skeleton
              height={SECONDARY_COL_HEIGHT / 2}
              radius="md"
              animate={false}
              visible={false}
            >
              <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
                <Text
                  color="dimmed"
                  size="xs"
                  transform="uppercase"
                  weight={700}
                >
                  Response
                </Text>
                <ScrollArea
                  style={{ marginTop: theme.spacing.md, height: "80%" }}
                >
                  <Text>
                    Database Ping: {data?.time.diff}ms
                    <br />
                  </Text>
                  <Text>
                    Request Time:{" "}
                    {data?.time
                      ? new Date(data?.time.start).toLocaleTimeString()
                      : null}
                  </Text>
                </ScrollArea>
              </Paper>
            </Skeleton>
          </Grid.Col>
          <Grid.Col span={6}>
            <Skeleton
              height={SECONDARY_COL_HEIGHT / 2}
              radius="md"
              animate={false}
              visible={false}
            >
              <Paper withBorder radius="md" p="xs" style={{ height: "100%" }}>
                <Text
                  color="dimmed"
                  size="xs"
                  transform="uppercase"
                  weight={700}
                >
                  Database Tables
                </Text>
                <ScrollArea
                  style={{ marginTop: theme.spacing.md, height: "80%" }}
                >
                  {data?.tables.map((e: any, i: number) => (
                    <Text key={i}>
                      {e}
                      <br />
                    </Text>
                  ))}
                </ScrollArea>
              </Paper>
            </Skeleton>
          </Grid.Col>
        </Grid>
      </SimpleGrid>
    </Page>
  );
};

export default DatabasePage;
