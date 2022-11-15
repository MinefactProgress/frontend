import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { darkTheme, lightTheme } from "../util/theme";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

import { AppProps } from "next/app";
import Head from "next/head";
import { Page } from "../components/Page";
import { SWRConfig } from "swr";
import { useState } from "react";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "scheme",
    defaultValue: "dark",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  useHotkeys([["mod+J", () => toggleColorScheme()]]);

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
          <Component {...pageProps} />
        </MantineProvider>{" "}
      </ColorSchemeProvider>
    </SWRConfig>
  );
}
