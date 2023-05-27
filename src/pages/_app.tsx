/* eslint-disable react/prop-types */
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

import { UserProvider } from "@/providers/UserProvider";
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
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
};

export default apiNext.withTRPC(MyApp);
