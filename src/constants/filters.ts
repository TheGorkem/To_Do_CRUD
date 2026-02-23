import type { FilterType } from "@/interfaces/ui";

export const FILTERS: { label: string; value: FilterType }[] = [
  { label: "Tümü", value: "all" },
  { label: "Aktif", value: "active" },
  { label: "Tamamlandı", value: "completed" }
];
