import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { darkTheme, lightTheme } from "../util/theme";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

import { AppProps } from "next/app";
import Head from "next/head";
import NavProgress from "../components/NavProgress";
import { Page } from "../components/Page";
import React from "react";
import { SWRConfig } from "swr";
import { initializeSocket } from "../hooks/useSocket";
import { useState } from "react";
import useUser from "../hooks/useUser";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [user] = useUser();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "scheme",
    defaultValue: "dark",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  initializeSocket(
    process.env.NEXT_PUBLIC_API_URL || "",
    ["motd"],
    user.apikey
  );

  return (
    <SWRConfig
      value={{
        refreshInterval: 0,
        fetcher: (resource: any, init: any) =>
          fetch(
            process.env.NEXT_PUBLIC_API_URL +
              resource +
              (resource.includes("?")
                ? "&key=" +
                  JSON.parse(window.localStorage.getItem("auth") || "{}").apikey
                : "?key=" +
                  JSON.parse(window.localStorage.getItem("auth") || "{}")
                    .apikey),
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                ...init?.headers,
              },
              ...init,
            }
          ).then((res) => res.json()),
        shouldRetryOnError: false,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={colorScheme == "dark" ? darkTheme : lightTheme}
          withGlobalStyles
          withNormalizeCSS
        >
          <NavProgress />
          <Component {...pageProps} />
        </MantineProvider>{" "}
      </ColorSchemeProvider>
    </SWRConfig>
  );
}
