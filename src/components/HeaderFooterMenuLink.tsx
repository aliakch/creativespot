/* eslint-disable @typescript-eslint/restrict-template-expressions */
import Link from "next/link";

import styles from "./HeaderFooterMenuLink.module.css";

interface HeaderFooterMenuLinkProps {
  href: string;
  text: string;
}
const HeaderFooterMenuLink = ({ href, text }: HeaderFooterMenuLinkProps) => {
  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <li
      className={`${styles.link} relative block text-lg font-medium text-white`}
    >
      <p>{text}</p>
    </li>
  );
};

export default HeaderFooterMenuLink;
