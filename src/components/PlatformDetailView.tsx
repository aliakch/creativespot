/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type Estate,
  type EstateType,
  type Metro,
  type User,
} from "@prisma/client";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import Link from "next/link";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

import CsAvatar from "@/components/CsAvatar";
import CsButton from "@/components/CsButton";
import MetroIcon from "@/images/MetroIcon.svg";
import PdfIcon from "@/images/PdfIcon.svg";
import { getPrettyPrice } from "@/utils/platform-helper";

export type UserWithTimestamps = Omit<
  User,
  "birth_date" | "emailVerified" | "created_at" | "updated_at"
> & {
  birth_date: number | null;
  emailVerified: number | null;
  created_at: number;
  updated_at: number;
};

export type PlatformPopulatedWithDates = Estate & {
  estate_type: EstateType;
  user: User;
  metro: Metro | null;
};

export type PlatformPopulated = Estate & {
  estate_type: EstateType;
  user: User;
  metro: Metro | null;
};

export default function PlatformDetailView({
  item,
}: {
  item: PlatformPopulated;
}) {
  const propertyData = [
    {
      title: "Площадь",
      value: `${item.area} м²`,
    },
    {
      title: "Тип",
      value: item.estate_type.name,
    },
  ];
  const price = item.price ? getPrettyPrice(item.price) : "По договоренности";
  const description = item.description
    ? item.description.split("\n").map((str, index) => <p key={index}>{str}</p>)
    : "";

  const photoGallery = item.photo_gallery
    ? (item.photo_gallery as string[])
    : null;

  const prettyUserName =
    item.user.first_name +
    " " +
    item.user.last_name.slice(0, 1).toLocaleUpperCase() +
    ".";
  return (
    <section>
      <div className="max-h-[600px]">
        {photoGallery && (
          <Splide aria-label="Photo Gallery">
            {photoGallery.map((photo, index) => (
              <SplideSlide key={index}>
                <div className="flex justify-center">
                  <Image
                    className="h-[300px] w-auto lg:h-[600px]"
                    src={photo}
                    alt=""
                    height={600}
                    width={900}
                  />
                </div>
              </SplideSlide>
            ))}
          </Splide>
        )}
      </div>

      {/* basic data */}
      <div className="my-8 grid grid-cols-1 lg:grid-cols-3">
        <div className="col-span-2">
          <div className="mb-3 flex flex-wrap">
            <h2 className="text-2xl font-semibold text-white">{item.name}</h2>
            <p className="ml-4 text-xl font-medium text-cs-dark-300">
              {item.area} м²
            </p>
          </div>
          <p className="mb-2 text-xl text-white">{item.address}</p>
          <div className="mb-4 flex flex-wrap items-center">
            <Image src={MetroIcon} alt="" className="mr-2 block h-4 w-auto" />
            <p className="text-xl font-medium text-white">{item.metro?.name}</p>
          </div>
        </div>
        <div className="col-span-1 rounded-3xl bg-cs-dark-800 p-6">
          <div className="grid grid-cols-12">
            <div className="col-span-5">
              <h4 className="text-3xl font-bold text-white">{price} Ꝑ</h4>
              {item.user.phone && (
                <>
                  <p className="mb-2 text-sm text-cs-dark-300">Телефон:</p>
                  <p className="font-medium text-cs-dark-300">
                    {item.user.phone}
                  </p>
                </>
              )}
            </div>
            <div className="col-span-7">
              <div className="flex flex-wrap">
                <p className="mb-2 flex w-full flex-wrap rounded-3xl bg-cs-dark-600 px-4 py-3">
                  <CsAvatar className="mr-2" label={prettyUserName} />
                  <span className="text-lg font-medium text-white">
                    {prettyUserName}
                  </span>
                </p>
                <div className="flex items-center justify-center">
                  <CsButton
                    className="text-sm"
                    rounded
                    type="link"
                    href={`/messages/?id=${item.user.id}`}
                  >
                    Написать сообщение
                  </CsButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* description, specifications */}
      <div className="grid grid-cols-1 gap-x-16 lg:grid-cols-8">
        <div className="lg:col-span-5">
          <h5 className="mb-2 text-2xl font-semibold text-white">Описание</h5>
          <div className="flex flex-col flex-wrap gap-2 text-lg text-white">
            {description}
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="my-4 lg:my-0 lg:px-8 lg:py-6">
            <h5 className="mb-2 text-2xl font-semibold text-white">
              Характеристики
            </h5>
            <DataTable showHeaders={false} value={propertyData}>
              <Column field="title" />
              <Column field="value" />
            </DataTable>
          </div>

          {item.presentation && (
            <div className="px-8">
              <div className="rounded-3xl border-2 border-cs-primary py-6">
                <Link
                  className="flex flex-wrap items-center justify-center"
                  href={item.presentation}
                >
                  <Image className="h-16 w-auto" src={PdfIcon} alt="" />
                  <h4 className="ml-4 text-lg font-semibold text-white hover:text-cs-primary">
                    Скачать презентацию
                  </h4>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
