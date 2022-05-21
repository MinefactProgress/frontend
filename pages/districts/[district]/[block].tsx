import Page from "../../../components/Page";
import { useRouter } from "next/router";

const BlockPage = () => {
  const router = useRouter();
  const { district,block } = router.query;
  return <Page title={district?.toString()}>{district}, Block {block}</Page>;
};

export default BlockPage;
