import dynamic from "next/dynamic";

export default dynamic(import("./MapLayer"), {
  ssr: false,
});