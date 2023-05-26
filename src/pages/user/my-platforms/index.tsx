import { useEffect, useState } from "react";

import CsButton from "@/components/CsButton";
import PlatformListingCard, {
  type EstateWithMetro,
} from "@/components/PlatformListingCard";
import { useMe } from "@/hooks/useMe";
import AccountLayout from "@/layouts/AccountLayout";
import { apiClient } from "@/utils/api";

export default function MyPlatformsPage() {
  const [platforms, setPlatforms] = useState<EstateWithMetro[] | false>(false);

  const me = useMe();

  useEffect(() => {
    const fetchData = async () => {
      const results = await apiClient.platforms.getMine.query();
      if (results.status === "ok") {
        setPlatforms(results.items);
      }
    };
    void fetchData();
  }, []);
  return (
    <>
      {me !== false && (
        <AccountLayout role={me.user_role.name} selectedOption="my-platforms">
          {!platforms && <p>Загрузка...</p>}
          {platforms && platforms.length === 0 && (
            <>
              <h4 className="mb-8 text-3xl font-bold text-white">
                У вас пока нет добавленных площадок.
              </h4>
              <div className="flex h-full items-center justify-center">
                <CsButton type="link" href="/user/my-platforms/add" filled>
                  Добавить площадку
                </CsButton>
              </div>
            </>
          )}
          {platforms && platforms.length > 0 && (
            <>
              <div className=" mb-8 flex flex-wrap">
                <h4 className="text-3xl font-bold text-white">Мои площадки</h4>
                <CsButton
                  className="ml-auto"
                  type="link"
                  href="/user/my-platforms/add"
                  filled
                >
                  Добавить площадку
                </CsButton>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {platforms.map((item) => (
                  <PlatformListingCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </AccountLayout>
      )}
    </>
  );
}
