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
import { NotificationsProvider } from "@mantine/notifications";
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
    user?.token
  );

  return (
    <SWRConfig
      value={{
        refreshInterval: 0,
        fetcher: (resource: any, init: any) =>
          fetch(process.env.NEXT_PUBLIC_API_URL + resource, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authentication:
                "Bearer " +
                JSON.parse(window.localStorage.getItem("auth") || "{}").token,
              ...init?.headers,
            },
            ...init,
          })
            .then((res) => res.json())
            .then((d) => d.data),
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
        <NotificationsProvider>
          <MantineProvider
            theme={colorScheme == "dark" ? darkTheme : lightTheme}
            withGlobalStyles
            withNormalizeCSS
          >
            <NavProgress />
            <Component {...pageProps} />
          </MantineProvider>
        </NotificationsProvider>
      </ColorSchemeProvider>
    </SWRConfig>
  );
}
