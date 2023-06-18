import "../styles/globals.css";

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { darkTheme, lightTheme } from "../util/theme";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

import { AppProps } from "next/app";
import CookieConsent from "../components/CookieConsent";
import Head from "next/head";
import NavProgress from "../components/NavProgress";
import { NextShield } from "next-shield";
import { NotificationsProvider } from "@mantine/notifications";
import { Page } from "../components/Page";
import { Permissions } from "../util/permissions";
import React from "react";
import { SWRConfig } from "swr";
import { initializeSocket } from "../hooks/useSocket";
import react from "react";
import useCookie from "../hooks/useCookie";
import { useRouter } from "next/router";
import { useState } from "react";
import useUser from "../hooks/useUser";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [user] = useUser();
  const router = useRouter();
  const cookie = useCookie();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "scheme",
    defaultValue: "dark",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  useHotkeys([["mod+J", () => cookie.consent && toggleColorScheme()]]);

  initializeSocket(process.env.NEXT_PUBLIC_API_URL || "", user?.token);

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
            <NextShield
              isAuth={user ? user?.permission >= Permissions.moderator : false}
              isLoading={false}
              router={router}
              privateRoutes={["/admin"]}
              hybridRoutes={["/", "/login", "/register"]}
              publicRoutes={["/login"]}
              accessRoute="/"
              loginRoute="/login"
              LoadingComponent={<p>Loading...</p>}
            >
              <NavProgress />
              <CookieConsent />
              <Component {...pageProps} />
            </NextShield>
          </MantineProvider>
        </NotificationsProvider>
      </ColorSchemeProvider>
    </SWRConfig>
  );
}
