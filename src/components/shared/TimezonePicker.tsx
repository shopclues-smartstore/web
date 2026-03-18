import { SearchableSelect } from "./SearchableSelect";

export interface TimezonePickerProps {
  value: string;
  onChange: (timezone: string) => void;
  timezones: string[];
  "data-testid"?: string;
  className?: string;
}

export function TimezonePicker({
  value,
  onChange,
  timezones,
  "data-testid": testId = "timezone",
  className,
}: TimezonePickerProps) {
  return (
    <SearchableSelect<string>
      value={value}
      onChange={onChange}
      options={timezones}
      getOptionValue={(t) => t}
      getOptionLabel={(t) => t}
      searchPlaceholder="Search timezones..."
      emptyMessage="No timezones match your search."
      data-testid={testId}
      className={className}
    />
  );
}
