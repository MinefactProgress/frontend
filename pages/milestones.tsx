import {
  Button,
  Container,
  Group,
  Text,
  Title,
  createStyles,
} from "@mantine/core";
import { useEffect, useState } from "react";

import Confetti from "react-confetti";
import CountUp from "react-countup";
import { useRouter } from "next/router";
import useSWR from "swr";

const useStyles = createStyles((theme) => ({
  root: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },

  label: {
    textAlign: "center",
    fontWeight: 900,
    userSelect: "none",
    fontSize: 300,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[6],

    [theme.fn.smallerThan("sm")]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: 38,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[5],

    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 500,
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));
const MilestonesPage = () => {
  const { classes } = useStyles();
  const { data: projects } = useSWR("/api/projects/get");
  const { data: milestones } = useSWR("/api/projects/milestones/recent");
  const size = useWindowSize();
  return (
    <>
      <Confetti
        numberOfPieces={1000}
        recycle={true}
        width={size.width}
        height={size.height}
      />
      <Container className={classes.root}>
        <div className={classes.label}>
          <CountUp end={projects ? projects.at(-1).projects : null} />
        </div>
        <Title className={classes.title}>
          🎉We did it!
          {milestones
            ? " " + Math.floor(milestones[0]?.projects / 1000) * 1000 + " "
            : null}
          Projects!🎉
        </Title>
        <Text
          color="dimmed"
          size="lg"
          align="center"
          className={classes.description}
        >
          On the
          {" " +
            new Date(
              milestones ? milestones[0]?.date : ""
            ).toLocaleDateString() +
            " "}
          after {milestones ? milestones[0]?.days : null} Days
        </Text>
      </Container>
    </>
  );
};
export default MilestonesPage;

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}
