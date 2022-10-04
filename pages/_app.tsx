import "../styles/globals.css";

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import React, { useEffect } from "react";
import { default as pages, default as routes } from "../components/routes";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import useSocket, { initializeSocket } from "../hooks/socket";

import type { AppProps } from "next/app";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./_error";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { SWRConfig } from "swr";
import { Search } from "tabler-icons-react";
import { SpotlightProvider } from "@mantine/spotlight";
import { io } from "socket.io-client";
import { useRouter } from "next/router";
import useUser from "../utils/hooks/useUser";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "scheme",
    defaultValue: "dark",
    getInitialValueInEffect: true,
  });
  // Authentication
  const [user, setUser] = useUser();

  const allowed =
    (routes.find((route) => route.href === router.pathname)?.permission || 1) <=
    (user.permission || 0);

  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };

  initializeSocket(process.env.NEXT_PUBLIC_API_URL || "", user.apikey);
  const socket = useSocket();

  useHotkeys([
    ["mod+J", () => toggleColorScheme()],
    ["mod+P", () => router.push("/users/" + user.username)],
    ["mod+S", () => router.push("/users/" + user.username + "/settings")],
    ["mod+1", () => router.push("/")],
    ["mod+2", () => router.push("/projects")],
    ["mod+3", () => router.push("/districts")],
    ["mod+4", () => router.push("/network")],
  ]);
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
                  <ErrorBoundary
                    FallbackComponent={ErrorPage}
                    onError={(error, info) => {
                      console.log(
                        "An error occoured, please report this to us."
                      );
                      console.log(" ");
                      console.log(error);
                      console.log(" ");
                      console.log(info),
                        console.log("at " + new Date().toISOString());
                    }}
                  >
                    <Component {...pageProps} user={user} setUser={setUser} />
                  </ErrorBoundary>
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
