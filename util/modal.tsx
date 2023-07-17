import { Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";

export const confirmModal = (data: {
  children?: any;
  title?: any;
  onCancel?: () => void;
  onConfirm?: () => void;
  labels?: any;
}) =>
  openConfirmModal({
    title: data.title || "Please confirm your action",
    children: data.children || (
      <Text size="sm">
        This action cannot be undone. Are you sure you want to continue?
      </Text>
    ),
    labels: data.labels || { confirm: "Confirm", cancel: "Cancel" },
    onCancel: data.onCancel,
    onConfirm: data.onConfirm,
  });
