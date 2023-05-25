import { useEffect, useState } from "react";

import PlatformListingCard, {
  type EstateWithMetro,
} from "@/components/PlatformListingCard";
import AccountLayout from "@/layouts/AccountLayout";
import { apiClient } from "@/utils/api";

export default function MyFavoritesPage() {
  const [favorites, setFavorites] = useState<EstateWithMetro[] | false>(false);

  useEffect(() => {
    const fetchData = async () => {
      const results = await apiClient.platforms.favorites.query();
      if (results.status === "ok") {
        setFavorites(results.items);
      }
    };
    void fetchData();
  }, []);
  return (
    <AccountLayout role="leaseholder" selectedOption="favorites">
      {!favorites && <p>Загрузка...</p>}
      {favorites && favorites.length === 0 && (
        <h4 className="text-xl font-semibold text-white">
          У вас нет понравившихся площадок.
        </h4>
      )}
      {favorites && favorites.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {favorites.map((item) => (
            <PlatformListingCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </AccountLayout>
  );
}
