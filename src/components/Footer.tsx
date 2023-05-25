/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import { useSession } from "next-auth/react";

import Logo from "@/images/Logo.svg";

import CsButton from "./CsButton";
import HeaderFooterMenuLink from "./HeaderFooterMenuLink";

export default function Footer() {
  const { status } = useSession();

  return (
    <footer className="my-14">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-wrap items-center">
            <div className="mb-4 mr-16 flex flex-wrap items-center lg:mb-0">
              <Image className="mr-5 block h-8 w-auto" src={Logo} alt="Лого" />
            </div>
            <p className="hidden text-white lg:block">
              Найдите свою площадку и <br />
              заявите о себе
            </p>
            <p className="block text-white lg:hidden">
              Найдите свою площадку и заявите о себе
            </p>
          </div>
          <div className="ml-auto hidden flex-wrap items-center lg:flex">
            <div className="items-center justify-center">
              <div className="flex flex-wrap gap-8 xl:gap-16">
                <HeaderFooterMenuLink href="/about" text="О нас" />
                <HeaderFooterMenuLink
                  href="/#how-it-works"
                  text="Как это работает"
                />
              </div>
            </div>
            {status !== "authenticated" && (
              <div className="ml-12 xl:ml-24">
                <CsButton type="link" href="/user/register">
                  Зарегистрироваться
                </CsButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
