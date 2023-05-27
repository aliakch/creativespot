/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import Like from "@/images/Like.svg";
import MetroIcon from "@/images/MetroIcon.svg";
import userState from "@/store/user";
import { apiClient } from "@/utils/api";
import { getPrettyPrice } from "@/utils/platform-helper";

import type { Estate, Metro } from "@prisma/client";

export type EstateWithMetro = Estate & {
  metro: Metro | null;
};

export default function PropertyListingCard({
  item,
}: {
  item: EstateWithMetro;
}) {
  const price = item.price ? getPrettyPrice(item.price) : "По договоренности";
  const [isFavorite, setFavorite] = useState(false);
  const { status } = useSession();
  const me = useRecoilValue(userState);

  useEffect(() => {
    if (me) {
      if (me.favorites.some((el) => el === item.id)) {
        setFavorite(true);
      }
    }
  }, [me]);

  const toggleFavorite = async () => {
    const response = await apiClient.users.toggleFavorite.query({
      platformId: item.id,
    });
    if (response.status === "ok") {
      setFavorite(!isFavorite);
    }
  };
  return (
    <div className="flex flex-wrap">
      <div className="relative">
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <Link className="photo block" href={`/platforms/${item.code}`}>
          {item.photo_cover && (
            <Image
              src={item.photo_cover}
              alt={item.name}
              width={400}
              height={300}
              className="w-full rounded-t-xl"
            />
          )}
        </Link>
        {status === "authenticated" && (
          <Image
            onClick={() => {
              void toggleFavorite();
            }}
            src={Like}
            alt="В избранное"
            className={`favorites-btn absolute h-8 w-8 ${
              isFavorite ? "active" : ""
            }`}
          />
        )}
      </div>

      <div className="w-full rounded-b-xl border-t-0 border-cs-dark-500 bg-cs-dark-800 p-3 pb-5">
        <Link
          className="mb-2 inline-block text-sm font-medium"
          href={`/platforms/${item.code}`}
        >
          <h4 className="text-white">{item.name}</h4>
        </Link>
        <div className="flex flex-wrap items-center">
          {item.price && (
            <p className="mr-4 text-lg font-semibold text-white">{price} Ꝑ</p>
          )}
          {!item.price && (
            <p className="mr-4 text-lg font-semibold text-white">
              По договоренности
            </p>
          )}
          {item.area && (
            <p className="ml-4 font-semibold text-cs-dark-300">
              {item.area} м²
            </p>
          )}
          <Image
            src={MetroIcon}
            alt=""
            className="ml-11 mr-2 block h-4 w-auto"
          />
          <p className="font-semibold text-white">{item.metro?.name}</p>
        </div>
        <p className="mt-2 text-cs-dark-300">{item.address}</p>
      </div>
    </div>
  );
}
