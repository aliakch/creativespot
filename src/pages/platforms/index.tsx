import { type EstateType, type Metro } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";

import PlatformListing from "@/components/PlatformListing";
import { type EstateWithMetro } from "@/components/PlatformListingCard";
import MainLayout from "@/layouts/MainLayout";
import { prisma } from "@/server/db";

const PlatformsPage = ({
  estates,
  estateTypes,
  metroStations,
}: {
  estates: EstateWithMetro[];
  estateTypes: EstateType[];
  metroStations: Metro[];
}) => {
  return (
    <>
      <Head>
        <title>CreativeSpot | Креативный мир Москвы</title>
        <meta
          name="description"
          content="Погрузитесь в креативный мир Москвы. Найдите свою площадку и заявите о себе"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <main className="container">
          <h1 className="mb-10 text-3xl font-bold text-white">
            Каталог площадок
          </h1>
          <section className="grid grid-cols-4 gap-x-8">
            {/* <PropertyFilter
              estateTypes={data.estateTypes}
              stations={data.metroStations}
            /> */}
            <PlatformListing items={estates} />
            <div className="col-span-1" />
            <div className="col-span-3 flex flex-wrap justify-center">
              {/* <Paginator className='my-4' first={first} rows={rows} totalRecords={120}></Paginator> */}
            </div>
          </section>
        </main>
      </MainLayout>
    </>
  );
};

export async function getStaticProps() {
  const estates = await prisma.estate.findMany({
    include: {
      metro: true,
    },
  });
  const metroStations = await prisma.metro.findMany();
  const estateTypes = await prisma.estateType.findMany();
  return {
    props: {
      estates: estates as EstateWithMetro[],
      estateTypes,
      metroStations,
    },
    revalidate: 10,
  };
}

export default PlatformsPage;
