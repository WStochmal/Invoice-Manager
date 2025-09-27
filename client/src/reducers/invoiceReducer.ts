// --- types ---

import type { Invoice } from "@/types/Invoice.type";
import { createNewItem } from "@/utils/invoice/createNewItem";
import {
  calculateInvoiceTotals,
  calculateItemPrices,
} from "@/utils/invoiceLocalCalculator";
type Action =
  | { type: "SET_INVOICE"; payload: Invoice }
  | {
      type: "UPDATE_INVOICE_FIELD";
      payload: { field: keyof Invoice; value: string | number };
    }
  | {
      type: "UPDATE_INVOICE_BUYER_FIELD";
      payload: { field: keyof Invoice["buyer"]; value: string | number };
    }
  | {
      type: "UPDATE_INVOICE_ITEM_FIELD";
      payload: {
        index: number;
        field: keyof Invoice["items"][number];
        value: string | number;
      };
    }
  | { type: "UPDATE_INVOICE_NEW_ITEM" }
  | { type: "UPDATE_INVOICE_REMOVE_ITEM"; payload: { index?: number } };

export const InvoiceReducer = (
  state: Invoice | null,
  action: Action
): Invoice | null => {
  if (!state && action.type !== "SET_INVOICE") return state;

  switch (action.type) {
    // --- Set current invoice (for form view) ---
    case "SET_INVOICE":
      return action.payload;

    // --- Update current invoice field (for form view) ---
    case "UPDATE_INVOICE_FIELD":
      return state
        ? { ...state, [action.payload.field]: action.payload.value }
        : state;
    // --- Update current invoice buyer field (for form view) ---

    case "UPDATE_INVOICE_BUYER_FIELD":
      return state
        ? {
            ...state,
            buyer: {
              ...state.buyer,
              [action.payload.field]: action.payload.value,
            },
          }
        : state;
    // --- Update current invoice item field (for form view) ---
    case "UPDATE_INVOICE_ITEM_FIELD": {
      if (!state) return state;
      const { index, field, value } = action.payload;
      let updatedItems = state.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      // --- Calculate prices if quantity or unitNetPrice or vatRate changed ---
      if (field !== "description") {
        updatedItems = updatedItems.map((item, i) =>
          i === index ? calculateItemPrices(updatedItems[i]) : item
        );
        const totals = calculateInvoiceTotals(updatedItems);
        return { ...state, items: updatedItems, ...totals };
      }

      return { ...state, items: updatedItems };
    }

    // --- Add new item to current invoice (for form view) ---
    case "UPDATE_INVOICE_NEW_ITEM": {
      if (!state) return state;
      const newItem = createNewItem();
      return { ...state, items: [...state.items, newItem] };
    }

    // --- Remove item from current invoice (for form view) ---
    case "UPDATE_INVOICE_REMOVE_ITEM": {
      if (!state) return state;
      const { index } = action.payload;
      let updatedItems = state.items;
      if (index !== undefined) {
        updatedItems = state.items.filter((_, i) => i !== index);
      } else {
        return state;
      }
      return {
        ...state,
        items: updatedItems,
        ...calculateInvoiceTotals(updatedItems),
      };
    }

    // --- Default ---
    default:
      return state;
  }
};
