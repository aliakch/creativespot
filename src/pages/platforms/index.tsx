import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import PlatformListing from "@/components/PlatformListing";
import PlatformListingFilter, {
  type PlatformListingFilterOptions,
} from "@/components/PlatformListingFilter";
import MainLayout from "@/layouts/MainLayout";
import { apiNext } from "@/utils/api";

const PlatformsPage = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<PlatformListingFilterOptions>({});
  const platforms = apiNext.platforms.getFilteredList.useQuery({
    ...filters,
  });
  const platformTypes = apiNext.platforms.getPlatformTypes.useQuery();
  const metroStations = apiNext.platforms.getMetro.useQuery();

  const handleFilters = (f: PlatformListingFilterOptions) => {
    const options = { ...f };
    console.log(options);
    for (const key of Object.keys(options)) {
      // @ts-expect-error all ok
      if (options[key] instanceof Date) {
        // @ts-expect-error all ok
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        options[key] = options[key].getTime();
      }
      // @ts-expect-error all ok
      if (options[key] === undefined || options[key] == null) {
        // @ts-expect-error all ok
        // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-dynamic-delete
        delete options[key];
      }
    }
    setFilters(options);
  };
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
          <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-4">
            {platformTypes.data && metroStations.data && (
              <div>
                <PlatformListingFilter
                  platformTypes={platformTypes.data}
                  metroStations={metroStations.data}
                  handleFilters={handleFilters}
                />
              </div>
            )}
            {platforms.data && (
              <>
                <PlatformListing items={platforms.data} />
                <div className="col-span-1 hidden lg:block" />
                <div className="flex flex-wrap justify-center lg:col-span-3">
                  {/* <Paginator className='my-4' first={first} rows={rows} totalRecords={120}></Paginator> */}
                </div>
              </>
            )}
            {!platforms.data && (
              <h4 className="text-2xl font-semibold">
                К сожалению, по вашему запросу площадок не найдено
              </h4>
            )}
          </section>
        </main>
      </MainLayout>
    </>
  );
};

export default PlatformsPage;
