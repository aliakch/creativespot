import { type EstateType, type Metro } from "@prisma/client";
import { AutoComplete } from "primereact/autocomplete";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { useEffect, useState } from "react";

interface PlatformListingFilterProps {
  platformTypes: EstateType[];
  metroStations: Metro[];
  handleFilters: (filters: PlatformListingFilterOptions) => void;
}

export interface PlatformListingFilterOptions {
  platform_type?: EstateType | null;
  metro?: Metro | null;
  price_from: number | null;
  price_to: number | null;
  area_from: number | null;
  area_to: number | null;
}

const PlatformListingFilter = ({
  platformTypes,
  metroStations,
  handleFilters,
}: PlatformListingFilterProps) => {
  const [filters, setFilters] = useState<PlatformListingFilterOptions>({
    platform_type: null,
    metro: null,
    price_from: null,
    price_to: null,
    area_from: null,
    area_to: null,
  });
  const [filteredMetroStations, setFilteredMetroStations] =
    useState<Metro[]>(metroStations);

  interface HandleInputEvent {
    value?: string | number;
    target?: {
      value: string | number;
    };
  }
  const handleInputChange = (
    prop:
      | "platform_type"
      | "metro"
      | "price_from"
      | "price_to"
      | "area_from"
      | "area_to",
    event: HandleInputEvent
  ) => {
    setFilters({ ...filters, [prop]: event.value });
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
            showClear
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
      <div className="flex flex-col gap-y-2 font-medium">
        <label htmlFor="price_from">Цена за день, руб</label>
        <InputNumber
          className="block w-full"
          inputId="price_from"
          value={filters.price_from}
          onChange={(e) => {
            handleInputChange("price_from", e);
          }}
          placeholder="от"
        />
        <InputNumber
          className="block"
          inputId="price_to"
          value={filters.price_to}
          onChange={(e) => {
            handleInputChange("price_to", e);
          }}
          placeholder="до"
        />
      </div>

      <div className="flex flex-col gap-y-2 font-medium">
        <label htmlFor="area_from">Площадь, м²</label>
        <InputNumber
          className="block w-full"
          inputId="area_from"
          value={filters.area_from}
          onChange={(e) => {
            handleInputChange("area_from", e);
          }}
          placeholder="от"
        />
        <InputNumber
          className="block"
          inputId="area_to"
          value={filters.area_to}
          onChange={(e) => {
            handleInputChange("area_to", e);
          }}
          placeholder="до"
        />
      </div>
    </div>
  );
};

export default PlatformListingFilter;
