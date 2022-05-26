import "../styles/globals.css";

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  MantineThemeOverride,
} from "@mantine/core";
import { Home, JewishStar, Search } from "tabler-icons-react";
import jwt, { sign, verify } from "../utils/jwt";
import { useEffect, useState } from "react";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

import type { AppProps } from "next/app";
import ErrorPage from "./_error";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { SWRConfig } from "swr";
import { SpotlightProvider } from "@mantine/spotlight";
import pages from "../components/routes";
import routes from "../components/routes";
import { useRouter } from "next/router";
import useUser from "../utils/hooks/useUser";

function MyApp({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  // Authentication
  const [user, setUser] = useUser();
  const router = useRouter();
  const allowed =
    (routes.find((route) => route.href === router.pathname)?.permission || 1) <=
    (user.permission || 0);
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);
  useHotkeys([["mod+1", () => router.push("/")]]);
  useHotkeys([["mod+2", () => router.push("/projects")]]);
  useHotkeys([["mod+3", () => router.push("/districts")]]);
  useHotkeys([["mod+4", () => router.push("/network")]]);
  return (
    <SWRConfig
      value={{
        refreshInterval: 0,
        fetcher: (resource: any, init: any) =>
          fetch(
            resource.includes("?")
              ? resource +
                  "&key=" +
                  JSON.parse(window.localStorage.getItem("auth") || "{}").apikey
              : resource +
                  "?key=" +
                  JSON.parse(window.localStorage.getItem("auth") || "{}")
                    .apikey,
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
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <SpotlightProvider
            actions={pages
              .map((page) => ({
                icon: page.icon,
                title: page.label,
                onTrigger: () => router.push(page.href || "/"),
              }))
              .filter(
                (page, i) =>
                  page.icon && pages[i].permission <= (user.permission || 0)
              )}
            searchIcon={<Search size={18} />}
            searchPlaceholder="Search..."
            shortcut="ctrl + K"
            nothingFoundMessage="Nothing found..."
          >
            <ModalsProvider>
              <NotificationsProvider>
                {(routes.find((route) => route.href === router.pathname)
                  ?.permission || 0) <= (user.permission || 0) ? (
                  <Component {...pageProps} user={user} setUser={setUser} />
                ) : (
                  <ErrorPage statuscode={401} />
                )}
              </NotificationsProvider>
            </ModalsProvider>
          </SpotlightProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </SWRConfig>
  );
}

export default MyApp;
