import { type EstateType, type Metro } from "@prisma/client";
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";

interface PlatformListingFilterProps {
  platformTypes: EstateType[];
  metroStations: Metro[];
  handleFilters: (filters: PlatformListingFilterOptions) => void;
}

export interface PlatformListingFilterOptions {
  platform_type?: EstateType | null;
  metro?: Metro | null;
}

const PlatformListingFilter = ({
  platformTypes,
  metroStations,
  handleFilters,
}: PlatformListingFilterProps) => {
  const [filters, setFilters] = useState<PlatformListingFilterOptions>({
    platform_type: null,
    metro: null,
  });
  const [filteredMetroStations, setFilteredMetroStations] =
    useState<Metro[]>(metroStations);

  const handleInputChange = (
    prop: "platform_type" | "metro",
    event: { target: { value: string } }
  ) => {
    setFilters({ ...filters, [prop]: event.target.value });
  };

  const metroSearch = (e: { query: string }) => {
    if (metroStations.length > 0) {
      setFilteredMetroStations(
        metroStations.filter((el) =>
          el.name.toLowerCase().includes(e.query.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    handleFilters(filters);
  }, [filters]);

  return (
    <div className="flex flex-col gap-y-4 rounded-2xl bg-cs-dark-800 p-6">
      {platformTypes && (
        <div className="flex flex-col gap-y-2 font-medium">
          <label htmlFor="platform_type">Тип площадки</label>
          <Dropdown
            options={platformTypes}
            optionLabel="name"
            value={filters.platform_type}
            placeholder="Выберите тип площадки"
            onChange={(e) => {
              handleInputChange("platform_type", e);
            }}
          />
        </div>
      )}
      {metroStations && (
        <div className="flex flex-col gap-y-2 font-medium">
          <label htmlFor="metro">Метро</label>
          <AutoComplete
            inputId="metro"
            field="name"
            forceSelection
            value={filters.metro}
            onChange={(e) => {
              handleInputChange("metro", e);
            }}
            suggestions={filteredMetroStations}
            completeMethod={metroSearch}
          />
        </div>
      )}
    </div>
  );
};

export default PlatformListingFilter;
