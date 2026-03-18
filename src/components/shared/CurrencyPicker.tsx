import { SearchableSelect } from "./SearchableSelect";

export interface CurrencyPickerProps {
  value: string;
  onChange: (currency: string) => void;
  currencies: string[];
  "data-testid"?: string;
  className?: string;
}

export function CurrencyPicker({
  value,
  onChange,
  currencies,
  "data-testid": testId = "currency",
  className,
}: CurrencyPickerProps) {
  return (
    <SearchableSelect<string>
      value={value}
      onChange={onChange}
      options={currencies}
      getOptionValue={(c) => c}
      getOptionLabel={(c) => c}
      searchPlaceholder="Search currencies..."
      emptyMessage="No currencies match your search."
      data-testid={testId}
      className={className}
    />
  );
}
