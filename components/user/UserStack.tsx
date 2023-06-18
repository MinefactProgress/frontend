import { Avatar, Group, ScrollArea, Table, Text } from "@mantine/core";

interface UsersStackProps {
  data: {
    avatar: string;
    name: string;
    role: string;
    data?: { text: string; description: string }[];
    menu?: React.ReactElement;
  }[];
}

export function UsersStack({ data }: UsersStackProps) {
  const rows = data?.map((item) => (
    <tr key={item.name}>
      <td>
        <Group spacing="sm">
          <Avatar size={40} src={item.avatar} radius={40} />
          <div>
            <Text size="sm" weight={500}>
              {item.name}
            </Text>
            <Text color="dimmed" size="xs">
              {item.role}
            </Text>
          </div>
        </Group>
      </td>
      {item.data?.map((d, i) => (
        <td key={i}>
          <Text size="sm">{d.text}</Text>
          <Text size="xs" color="dimmed">
            {d.description}
          </Text>
        </td>
      ))}
      <td>
        <Group spacing={0} position="right">
          {item.menu}
        </Group>
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <Table verticalSpacing="md">
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
