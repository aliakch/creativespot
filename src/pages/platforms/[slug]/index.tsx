import { getDate, getTime } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import PlatformDetailView, {
  type PlatformPopulated,
} from "@/components/PlatformDetailView";
import PlatformListingCard, {
  type EstateWithMetro,
} from "@/components/PlatformListingCard";
import MainLayout from "@/layouts/MainLayout";
import { apiClient } from "@/utils/api";

const PlatformDetailPage = () => {
  const router = useRouter();
  const [platform, setPlatform] = useState<PlatformPopulated | false>(false);
  const [additionalPlatforms, setAdditionalPlatforms] = useState<
    EstateWithMetro[] | false
  >(false);

  useEffect(() => {
    const getByCode = async () => {
      const s = router.query.slug;
      console.log(s);
      if (s) {
        const p = await apiClient.platforms.getByCode.query({
          code: s as unknown as string,
        });
        if (p) {
          setPlatform(p);
        }
        const pa = await apiClient.platforms.getAdditional.query();
        if (pa) {
          setAdditionalPlatforms(pa);
        }
      }
    };
    void getByCode();
  }, [router.query.slug]);
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
        {platform && (
          <main className="container">
            <h1 className="mb-10 text-3xl font-bold">{platform.name}</h1>
            <section>
              <PlatformDetailView item={platform} />
              <div className="mt-12">
                <h5 className="mb-4 text-xl font-semibold">Похожие площадки</h5>
                <div className="grid gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
                  {additionalPlatforms &&
                    additionalPlatforms.map((item) => (
                      <PlatformListingCard item={item} key={item.id} />
                    ))}
                </div>
              </div>
            </section>
          </main>
        )}
      </MainLayout>
    </>
  );
};

export default PlatformDetailPage;
