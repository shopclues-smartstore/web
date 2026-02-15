import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchableSelectProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: T[];
  getOptionValue: (option: T) => string;
  getOptionLabel: (option: T) => string;
  /** If provided, used for search filter instead of getOptionLabel. */
  getSearchText?: (option: T) => string;
  renderTrigger?: (option: T) => React.ReactNode;
  renderOption?: (option: T, selected: boolean) => React.ReactNode;
  searchPlaceholder: string;
  emptyMessage: string;
  "data-testid"?: string;
  className?: string;
  triggerClassName?: string;
}

export function SearchableSelect<T>({
  value,
  onChange,
  options,
  getOptionValue,
  getOptionLabel,
  getSearchText,
  renderTrigger,
  renderOption,
  searchPlaceholder,
  emptyMessage,
  "data-testid": testIdPrefix = "searchable-select",
  className,
  triggerClassName,
}: SearchableSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const valueKey = value ? getOptionValue(value) : "";
  const searchFn = getSearchText ?? getOptionLabel;
  const filteredOptions = search.trim()
    ? options.filter((opt) =>
        searchFn(opt).toLowerCase().includes(search.toLowerCase())
      )
    : options;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (option: T) => {
    onChange(option);
    setOpen(false);
    setSearch("");
  };

  const displayTrigger = renderTrigger
    ? renderTrigger(value)
    : value
      ? getOptionLabel(value)
      : null;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        data-testid={testIdPrefix + "-selector"}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-input bg-transparent h-10 px-3 text-sm shadow-sm hover:bg-muted/50 transition-colors",
          triggerClassName
        )}
      >
        <span className="truncate pr-2 flex items-center gap-2 min-w-0">
          {displayTrigger}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div
          data-testid={testIdPrefix + "-dropdown"}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg z-20 animate-fade-up overflow-hidden flex flex-col max-h-64"
        >
          <div className="p-1.5 border-b border-border sticky top-0 bg-white">
            <div className="flex items-center gap-2 rounded-lg border border-input bg-muted/30 px-2.5 py-1.5">
              <Search className="size-3.5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto p-1 max-h-52">
            {filteredOptions.length ? (
              filteredOptions.map((option) => {
                const key = getOptionValue(option);
                const selected = key === valueKey;
                return (
                  <button
                    key={key}
                    type="button"
                    data-testid={`${testIdPrefix}-option-${key}`}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                      selected
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {renderOption
                      ? renderOption(option, selected)
                      : getOptionLabel(option)}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                {emptyMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
