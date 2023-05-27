import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useMe } from "@/hooks/useMe";
import userState from "@/store/user";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = useMe();
  const setUser = useSetRecoilState(userState);
  useEffect(() => {
    setUser(me);
  }, [me]);

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
