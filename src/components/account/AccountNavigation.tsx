import Link from "next/link";

import { type Role } from "@/types/user";

const AccountNavigationLink = ({
  href,
  isSelected = false,
  text,
}: {
  isSelected: boolean;
  text: string;
  href: string;
}) => {
  return (
    <li>
      <Link
        href={href}
        className={`block rounded-lg px-4 py-3 ${
          isSelected ? "bg-cs-red-dark hover:bg-cs-red" : "hover:bg-cs-dark-600"
        }`}
      >
        {text}
      </Link>
    </li>
  );
};

interface AccountNavigationLinkData {
  code: string;
  text: string;
  href: string;
  active: boolean;
  roles: Role[];
}

const getActiveLinksData = (selectedOption: string, role: Role) => {
  const links: AccountNavigationLinkData[] = [
    {
      code: "general",
      text: "Общая информация",
      href: "/user",
      active: false,
      roles: ["admin", "leaseholder", "owner"],
    },
    {
      code: "favorites",
      text: "Избранное",
      href: "/user/favorites",
      active: false,
      roles: ["leaseholder"],
    },
    {
      code: "my-platforms",
      text: "Мои площадки",
      href: "/user/my-platforms",
      active: false,
      roles: ["owner"],
    },
    {
      code: "my-platforms",
      text: "Доступные площадки",
      href: "/user/my-platforms",
      active: false,
      roles: ["admin"],
    },
    {
      code: "reviews",
      text: "Отзывы обо мне",
      href: "/user/reviews",
      active: false,
      roles: ["leaseholder", "owner"],
    },
    {
      code: "settings",
      text: "Настройки",
      href: "/user/settings",
      active: false,
      roles: ["admin", "leaseholder", "owner"],
    },
  ];
  return links
    .filter((link) => link.roles.includes(role))
    .map((link) => {
      if (selectedOption === link.code) {
        return {
          ...link,
          ...{ active: true },
        };
      }
      return link;
    });
};

const AccountNavigation = ({
  role,
  selectedOption,
}: {
  role: Role;
  selectedOption: string;
}) => {
  const links = getActiveLinksData(selectedOption, role);
  return (
    <ul className="flex flex-col gap-y-4">
      {links.map((link) => (
        <AccountNavigationLink
          key={link.code}
          href={link.href}
          text={link.text}
          isSelected={link.active}
        />
      ))}
    </ul>
  );
};

export default AccountNavigation;
