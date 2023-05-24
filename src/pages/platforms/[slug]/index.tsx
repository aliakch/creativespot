import { getDate, getTime } from "date-fns";
import Head from "next/head";

import PlatformDetailView, {
  type PlatformPopulated,
  type UserWithTimestamps,
} from "@/components/PlatformDetailView";
import PlatformListingCard, {
  type EstateWithMetro,
} from "@/components/PlatformListingCard";
import MainLayout from "@/layouts/MainLayout";
import { prisma } from "@/server/db";

const PlatformDetailPage = ({
  platform,
  additionalPlatforms,
}: {
  platform: PlatformPopulated;
  additionalPlatforms: EstateWithMetro[];
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
          <h1 className="mb-10 text-3xl font-bold">{platform.name}</h1>
          <section>
            <PlatformDetailView item={platform} />
            <div className="mt-12">
              <h5 className="mb-4 text-xl font-semibold">Похожие площадки</h5>
              <div className="grid gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
                {additionalPlatforms.map((item) => (
                  <PlatformListingCard item={item} key={item.id} />
                ))}
              </div>
            </div>
          </section>
        </main>
      </MainLayout>
    </>
  );
};

export async function getStaticProps({ slug }: { slug: string }) {
  const platform = await prisma.estate.findFirst({
    where: {
      code: slug,
    },
    include: {
      estate_type: true,
      metro: true,
      user: true,
    },
  });
  if (!platform) return;
  const user: UserWithTimestamps = {
    ...platform.user,
    ...{
      birth_date: platform.user.birth_date
        ? getDate(platform.user.birth_date)
        : null,
      created_at: getDate(platform.user.created_at),
      updated_at: getDate(platform.user.updated_at),
      emailVerified: platform.user.emailVerified
        ? getDate(platform.user.emailVerified)
        : null,
    },
  };

  const additionalPlatforms = await prisma.estate.findMany({
    take: 3,
    include: {
      metro: true,
    },
  });
  return {
    props: {
      platform: {
        ...platform,
        ...{ user },
      },
      additionalPlatforms,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const platforms = await prisma.estate.findMany({
    select: {
      id: true,
      code: true,
    },
  });
  const paths = platforms.map((platform) => ({
    params: { slug: platform.code },
  }));
  return { paths, fallback: "blocking" };
}

export default PlatformDetailPage;
