import type { Items } from "@/types/Items";

export const createNewItem = (): Items => ({
  description: "",
  quantity: 1,
  unitNetPrice: 0.0,
  netPrice: 0.0,
  vatRate: 0.0,
  vatPrice: 0.0,
  grossPrice: 0.0,
});
