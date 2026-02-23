import type { FilterType } from "@/interfaces/ui";
import { FILTERS } from "@/constants/filters";
import { cn } from "@/utils/cn";

interface FilterTabsProps {
  value: FilterType;
  onChange: (value: FilterType) => void;
}

const FilterTabs = ({ value, onChange }: FilterTabsProps) => (
  <div className="flex flex-wrap gap-2">
    {FILTERS.map((filter) => (
      <button
        key={filter.value}
        className={cn(
          "rounded-full border px-4 py-1.5 text-xs font-semibold",
          value === filter.value
            ? "border-ember/60 bg-ember/20 text-white"
            : "border-slate-200/70 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
        )}
        onClick={() => onChange(filter.value)}
      >
        {filter.label}
      </button>
    ))}
  </div>
);

export default FilterTabs;
