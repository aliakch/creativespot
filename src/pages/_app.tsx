/* eslint-disable react/prop-types */
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { apiNext } from "@/utils/api";

import "primereact/resources/primereact.min.css";
import "@/styles/primereact.css";
import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default apiNext.withTRPC(MyApp);
