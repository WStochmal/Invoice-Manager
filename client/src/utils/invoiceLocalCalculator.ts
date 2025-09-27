// --- types ---
import type { Items } from "@/types/Items";

//  --- Calculate item prices ---
export const calculateItemPrices = (item: Items): Items => {
  const quantity = Number(item.quantity) || 0;
  const unitNetPrice = Number(item.unitNetPrice) || 0;
  const vatRate = Number(item.vatRate) || 0;

  const netPrice = quantity * unitNetPrice;
  const vatPrice = netPrice * vatRate;
  const grossPrice = netPrice + vatPrice;

  return { ...item, netPrice, vatPrice, grossPrice };
};

//  --- Calculate total ---
export const calculateInvoiceTotals = (items: Items[]) => {
  const totalNetPrice = items.reduce((sum, item) => sum + item.netPrice, 0);
  const totalVatPrice = items.reduce((sum, item) => sum + item.vatPrice, 0);
  const totalGrossPrice = items.reduce((sum, item) => sum + item.grossPrice, 0);

  return { totalNetPrice, totalVatPrice, totalGrossPrice };
};
