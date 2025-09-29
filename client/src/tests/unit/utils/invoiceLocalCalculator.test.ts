import {
  calculateItemPrices,
  calculateInvoiceTotals,
} from "../../../utils/invoiceLocalCalculator";
import type { Items } from "../../../types/Items";

describe("Invoice Local Calculator", () => {
  describe("calculateItemPrices", () => {
    it("should calculate correct prices for a simple item", () => {
      const item: Items = {
        description: "Test item",
        quantity: 2,
        unitNetPrice: 100,
        vatRate: 0.23, // 23% VAT
        netPrice: 0,
        vatPrice: 0,
        grossPrice: 0,
      };

      const result = calculateItemPrices(item);

      expect(result.netPrice).toBe(200);
      expect(result.vatPrice).toBe(46);
      expect(result.grossPrice).toBe(246);
    });

    it("should handle zero values correctly", () => {
      const item: Items = {
        description: "Zero item",
        quantity: 0,
        unitNetPrice: 100,
        vatRate: 0.23,
        netPrice: 0,
        vatPrice: 0,
        grossPrice: 0,
      };

      const result = calculateItemPrices(item);

      expect(result.netPrice).toBe(0);
      expect(result.vatPrice).toBe(0);
      expect(result.grossPrice).toBe(0);
    });

    it("should handle different VAT rates", () => {
      const item: Items = {
        description: "Different VAT item",
        quantity: 1,
        unitNetPrice: 100,
        vatRate: 0.08, // 8% VAT
        netPrice: 0,
        vatPrice: 0,
        grossPrice: 0,
      };

      const result = calculateItemPrices(item);

      expect(result.netPrice).toBe(100);
      expect(result.vatPrice).toBe(8);
      expect(result.grossPrice).toBe(108);
    });
  });

  describe("calculateInvoiceTotals", () => {
    it("should calculate totals for multiple items", () => {
      const items: Items[] = [
        {
          description: "Item 1",
          quantity: 2,
          unitNetPrice: 100,
          vatRate: 0.23,
          netPrice: 200,
          vatPrice: 46,
          grossPrice: 246,
        },
        {
          description: "Item 2",
          quantity: 1,
          unitNetPrice: 50,
          vatRate: 0.08,
          netPrice: 50,
          vatPrice: 4,
          grossPrice: 54,
        },
      ];

      const result = calculateInvoiceTotals(items);

      expect(result.totalNetPrice).toBe(250);
      expect(result.totalVatPrice).toBe(50);
      expect(result.totalGrossPrice).toBe(300);
    });

    it("should return zeros for empty items array", () => {
      const items: Items[] = [];

      const result = calculateInvoiceTotals(items);

      expect(result.totalNetPrice).toBe(0);
      expect(result.totalVatPrice).toBe(0);
      expect(result.totalGrossPrice).toBe(0);
    });
  });
});
