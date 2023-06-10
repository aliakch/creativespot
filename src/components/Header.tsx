/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Hamburger from "hamburger-react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Sidebar } from "primereact/sidebar";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import CsButton from "@/components/CsButton";
import HeaderFooterMenuLink from "@/components/HeaderFooterMenuLink";
import HeaderChatIcon from "@/images/HeaderChatIcon.svg";
import LikeDark from "@/images/LikeDark.svg";
import Logo from "@/images/Logo.svg";
import userState from "@/store/user";
import { getPrettyUserName } from "@/utils/platform-helper";

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { status } = useSession();

  const me = useRecoilValue(userState);

  const [userFullName, setUserFullName] = useState("");

  useEffect(() => {
    if (me) {
      setUserFullName(getPrettyUserName(me.first_name, me.last_name));
    }
  }, [me]);

  return (
    <header className="py-4 lg:mb-4">
      <div className="container flex items-center">
        <div className="flex flex-wrap">
          <Link className="mr-14 flex flex-wrap items-center" href="/">
            <Image className="mr-8 block h-7 w-auto" src={Logo} alt="" />
          </Link>

          <div className="hidden flex-wrap items-center justify-center lg:flex">
            <div>
              <ul className="flex flex-wrap gap-x-14">
                <HeaderFooterMenuLink href="/" text="Главная" />
                <HeaderFooterMenuLink
                  // href={`${
                  //   status === "authenticated" ? "/platforms/" : "/user/login"
                  // }`}
                  href="/platforms/"
                  text="Площадки"
                />
              </ul>
            </div>
          </div>
        </div>
        <div className="ml-auto hidden flex-wrap items-center justify-end gap-x-4 text-lg font-semibold lg:flex">
          {status !== "authenticated" && (
            <>
              <CsButton type="link" href="/user/register">
                Регистрация
              </CsButton>
              <CsButton type="link" href="/user/login">
                Войти
              </CsButton>
            </>
          )}
          {status === "authenticated" && userFullName !== "" && (
            <>
              <Link className="block" href="/user/favorites">
                <Image src={LikeDark} alt="" height={40} width={40} />
              </Link>
              <Link className="block" href="/messages">
                <div className="flex h-10 w-10 items-center justify-center">
                  <Image src={HeaderChatIcon} alt="" height={22} width={22} />
                </div>
              </Link>
              <CsButton type="link" href="/user/">
                {userFullName}
              </CsButton>
              <CsButton
                onClick={() => {
                  void signOut({ callbackUrl: "/" });
                }}
              >
                Выйти
              </CsButton>
            </>
          )}
        </div>
        <div className="ml-auto flex gap-x-4 lg:hidden">
          <Sidebar
            visible={isMenuOpen}
            position="right"
            onHide={() => {
              setMenuOpen(false);
            }}
          >
            <div className="flex h-full flex-col">
              <ul className="flex flex-col flex-wrap gap-y-6">
                <HeaderFooterMenuLink href="/" text="Главная" />
                <HeaderFooterMenuLink href="/platforms" text="Площадки" />
              </ul>
              <div className="mt-auto flex justify-around">
                {status !== "authenticated" && (
                  <>
                    <CsButton type="link" href="/user/register">
                      Регистрация
                    </CsButton>
                    <CsButton type="link" href="/user/login">
                      Войти
                    </CsButton>
                  </>
                )}
                {status === "authenticated" && userFullName !== "" && (
                  <>
                    <CsButton type="link" href="/user/">
                      {userFullName}
                    </CsButton>
                    <CsButton
                      onClick={() => {
                        void signOut({ callbackUrl: "/" });
                      }}
                    >
                      Выйти
                    </CsButton>
                  </>
                )}
              </div>
            </div>
          </Sidebar>
          <Link className="block" href="/user/favorites">
            <Image src={LikeDark} alt="" height={40} width={40} />
          </Link>
          <Link className="block" href="/messages">
            <div className="flex h-10 w-10 items-center justify-center">
              <Image src={HeaderChatIcon} alt="" height={22} width={22} />
            </div>
          </Link>
          <Hamburger toggled={isMenuOpen} toggle={setMenuOpen} color="#fff" />
        </div>
      </div>
    </header>
  );
}
