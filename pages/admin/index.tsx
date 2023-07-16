import { NextPage } from "next";
import { IconTool } from "@tabler/icons";
import { Page } from "../../components/Page";
import { AdminPanel } from "../../components/AdminPanel";

const AdminPage: NextPage = ({}: any) => {
  return (
    <Page name="Admin Panel" icon={<IconTool />} noMargin>
      <AdminPanel />
    </Page>
  );
};

export default AdminPage;
