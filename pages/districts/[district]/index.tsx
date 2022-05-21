import Page from "../../../components/Page";
import { useRouter } from "next/router";

const DistrictPage = () => {
  const router = useRouter();
  const {district} = router.query;
  return <Page>{district}</Page>;
};

export default DistrictPage;
