import {
  Alert,
  Badge,
  Button,
  Center,
  Checkbox,
  Group,
  LoadingOverlay,
  Modal,
  MultiSelect,
  NumberInput,
  Paper,
  Progress,
  SegmentedControl,
  Table,
  Text,
  createStyles,
  useMantineTheme,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconBackhoe,
  IconBuildingCommunity,
  IconCheck,
  IconUser,
} from "@tabler/icons";
import {
  progressToColorName,
  statusToColorName,
  statusToName,
} from "../../../util/block";
import useSWR, { mutate } from "swr";

import { BackButton } from "../../../components/FastNavigation";
import type { NextPage } from "next";
import { Page } from "../../../components/Page";
import { Permissions } from "../../../util/permissions";
import { ProgressCard } from "../../../components/Stats";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useState } from "react";
import useUser from "../../../hooks/useUser";

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
const Districts: NextPage = ({ id }: any) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const { data } = useSWR(`/v1/districts/${id}`);
  const [editBlock, setEditBlock] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const { data: users } = useSWR("/v1/users");
  const [user] = useUser();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if ((user?.permission || 0) >= Permissions.builder) {
      if (
        editBlock &&
        editBlock !=
          data?.blocks.blocks.find((b: any) => b.id === editBlock?.id)
      ) {
        fetch(process.env.NEXT_PUBLIC_API_URL + `/v1/blocks/${editBlock.uid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user?.token,
          },
          body: JSON.stringify({
            district: data.id,
            builder: editBlock.builders,
            details: editBlock.details,
            progress: editBlock.progress,
            id: editBlock.id,
            uid: editBlock.uid,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.error) {
              showNotification({
                title: "Error Updating Block",
                message: res.message,
                color: "red",
              });
            } else {
              showNotification({
                title: "Block Updated",
                message:
                  "The data of Block " + editBlock?.id + " has been updated",
                color: "green",
                icon: <IconCheck />,
              });

              mutate(`/v1/districts/${id}`);
            }
          });
      } else {
        showNotification({
          title: "Nothing Changed",
          message: "No changes were made to the block",
        });
      }
    }
  };

  return (
    <Page name="Districts" icon={<IconBuildingCommunity />}>
      <LoadingOverlay visible={!data} />
      <Modal
        size="md"
        centered
        opened={editOpen}
        onClose={() => setEditOpen(false)}
        title={`Block #${editBlock?.id}`}
      >
        <form onSubmit={handleSubmit}>
          <MultiSelect
            dropdownPosition="top"
            label="Builders"
            searchable
            disabled={!user}
            nothingFound="No builder found"
            placeholder="Select Builders"
            maxDropdownHeight={190}
            icon={<IconUser size={18} />}
            data={
              user
                ? [
                    {
                      value: user?.username ? user.username : "",
                      label: user?.username,
                      group: "You",
                    },
                  ].concat(
                    /*adminsettings?.value.map((s: any) => ({
                value: s,
                label: s,
                group: "Special",
              })),*/
                    users
                      ?.filter(
                        (u: any) =>
                          u.username !== "root" && u.username !== user?.username
                      )
                      .sort((a: any, b: any) =>
                        a.username.localeCompare(b.username)
                      )
                      .map((u: any) => ({
                        value: u.username,
                        label: u.username,
                        group: "Other Users",
                      }))
                  )
                : []
            }
            value={editBlock?.builders?.length >= 1 && editBlock?.builders}
            onChange={(e: any) => {
              setEditBlock({
                ...editBlock,
                builders: e,
              });
            }}
          />
          <NumberInput
            mt="md"
            label="Progress"
            disabled={!user}
            min={0}
            max={100}
            icon={<IconBackhoe size={18} />}
            value={editBlock?.progress}
            onChange={(e: any) => {
              setEditBlock({
                ...editBlock,
                progress: e,
              });
            }}
          />
          <Progress value={editBlock?.progress} mt="xs" />
          <Checkbox
            label="Street Details"
            mt="md"
            disabled={editBlock?.progress != 100 || !user}
            checked={editBlock?.details}
            onChange={(e: any) => {
              setEditBlock({
                ...editBlock,
                details: e.currentTarget.checked,
              });
            }}
          />

          <Button type="submit" mt="md" fullWidth disabled={!user}>
            Update Block
          </Button>
        </form>
      </Modal>
      <div
        style={{
          marginBottom: theme.spacing.md,
          zIndex: 55,
          minWidth: "25vw",
        }}
      >
        <Group mb="md">
          <BackButton variant="outline" />
          <SegmentedControl
            value="table"
            onChange={(value) =>
              value == "table"
                ? router.push(`/districts/${id}/table`)
                : router.push(`/districts/${id}`)
            }
            color="primary"
            data={[
              { label: "Map", value: "map" },
              { label: "Table", value: "table" },
            ]}
          />
        </Group>
        <ProgressCard
          value={data?.blocks.done}
          title={data?.name}
          max={data?.blocks.total}
          descriptor="Blocks finished"
        ></ProgressCard>
        {data?.blocks.blocks.at(-1).area.length <= 0 && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Warning!"
            color="red"
            variant="outline"
            mt="md"
          >
            There may be blocks missing on this map, please wait till we have
            <br />
            added them. You cant change the progress of those yet.
          </Alert>
        )}
      </div>
      <Paper withBorder radius="md" p="xs">
        <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
          Boroughs
        </Text>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>ID</th>
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
                  <tr
                    key={block.name}
                    onClick={(e) => {
                      setEditBlock(block);
                      setEditOpen(true);
                    }}
                  >
                    <td>{block.id}</td>
                    <td>
                      <Badge color={statusToColorName(block.status)}>
                        {statusToName(block.status)}
                      </Badge>
                    </td>
                    <td>
                      <Center>{block.progress.toFixed(2) + "%"}</Center>
                      <Progress
                        size="sm"
                        value={block.progress}
                        color={progressToColorName(block.progress)}
                      />
                    </td>
                    <td>
                      <Checkbox checked={block.details} readOnly></Checkbox>
                    </td>
                    <td>{block.builders.join(", ") || "---"}</td>
                    <td>
                      {block.completionDate
                        ? new Date(block.completionDate).toLocaleDateString()
                        : "---"}
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </Table>
      </Paper>
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
export async function getServerSideProps({ params }: any) {
  return { props: { id: params.id } };
}

export default Districts;
