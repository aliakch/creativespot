/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Hamburger from "hamburger-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import CsButton from "@/components/CsButton";
import HeaderFooterMenuLink from "@/components/HeaderFooterMenuLink";
import Logo from "@/images/Logo.svg";

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="py-4 lg:mb-4">
        <div className="container flex items-center">
          <div className="flex flex-wrap">
            <Link className="mr-14 flex flex-wrap items-center" href="/">
              <Image
                className="mr-8 block h-8 w-8 lg:h-12 lg:w-auto"
                src={Logo}
                alt=""
                height={55}
                width={55}
              />
              <h4 className="font-semibold text-white lg:text-xl">
                CreativeSpot
              </h4>
            </Link>

            <div className="hidden flex-wrap items-center justify-center lg:flex">
              <div>
                <ul className="flex flex-wrap gap-x-14">
                  <HeaderFooterMenuLink href="/" text="Главная" />
                  <HeaderFooterMenuLink href="/estate" text="Площадки" />
                </ul>
              </div>
            </div>
          </div>
          <div className="ml-auto hidden flex-wrap items-center justify-end gap-x-8 text-lg font-semibold lg:flex">
            <CsButton>Регистрация</CsButton>
            <CsButton>Войти</CsButton>
          </div>
          <div className="ml-auto block lg:hidden">
            <Hamburger toggled={isMenuOpen} toggle={setMenuOpen} color="#fff" />
          </div>
        </div>
      </header>
    </>
  );
}
