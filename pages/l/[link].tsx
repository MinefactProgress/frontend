import {
    ActionIcon,
    Button,
    Container,
    Group,
    Text,
    Title,
    createStyles,
} from "@mantine/core";
import { useEffect, useState } from "react";

import { ArrowLeft } from "tabler-icons-react";
import Confetti from "react-confetti";
import CountUp from "react-countup";
import Head from "next/head";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/router";
import useSWR from "swr";

const MilestonesPage = () => {
    const router = useRouter()
    useEffect(() => {
        window.location.href = "https://progressbackend.minefact.de/links/"+router.query.link;
    })
    return <div>
        <h2>Redirecting...</h2>
    </div>
  };
  export default MilestonesPage;
  