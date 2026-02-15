import { SearchableSelect } from "./SearchableSelect";
import { COUNTRIES, type Country } from "@/shared/constants/countries";

export interface CountryPickerProps {
  value: Country;
  onChange: (country: Country) => void;
  countries?: Country[];
  "data-testid"?: string;
  className?: string;
}

export function CountryPicker({
  value,
  onChange,
  countries = COUNTRIES,
  "data-testid": testId = "country",
  className,
}: CountryPickerProps) {
  return (
    <SearchableSelect<Country>
      value={value}
      onChange={onChange}
      options={countries}
      getOptionValue={(c) => c.code}
      getOptionLabel={(c) => c.name}
      getSearchText={(c) => `${c.name} ${c.code}`}
      renderTrigger={(c) => (
        <>
          <span className="text-base">{c.flag}</span>
          {c.name}
        </>
      )}
      renderOption={(c) => (
        <>
          <span className="text-base">{c.flag}</span>
          {c.name}
        </>
      )}
      searchPlaceholder="Search countries..."
      emptyMessage="No countries match your search."
      data-testid={testId}
      className={className}
    />
  );
}
