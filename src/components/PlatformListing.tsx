import PlatformListingCard, {
  type EstateWithMetro,
} from "@/components/PlatformListingCard";

export default function PropertyListing({
  items,
}: {
  items: EstateWithMetro[];
}) {
  return (
    <div className="col-span-1 grid gap-x-6 gap-y-8 lg:col-span-3 lg:grid-cols-2 ">
      {items.map((item) => (
        <PlatformListingCard item={item} key={item.id} />
      ))}
    </div>
  );
}
