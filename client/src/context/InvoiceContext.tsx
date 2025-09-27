// --- libs ---
import React, { createContext, useReducer, useState } from "react";

// --- api ---
import { InvoiceApi } from "@/api/invoiceApi";

// -- hooks ---
import useApiCall from "@/api/hooks/useApiCall";

// --- reducer ---
import { InvoiceReducer } from "@/reducers/invoiceReducer";

export const InvoiceContext = createContext<InvoiceContextProps | undefined>(
  undefined
);
// --- types ---
import type { Invoice } from "@/types/Invoice.type";
import { createNewInvoice } from "@/utils/invoice/createNewInvoice";
type InvoiceContextProps = {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  fetchInvoices: ReturnType<typeof useApiCall<Invoice[], void>>;
  fetchInvoiceById: ReturnType<typeof useApiCall<Invoice, string>>;
  createInvoice: ReturnType<typeof useApiCall<Invoice, Invoice>>;
  updateInvoice: ReturnType<typeof useApiCall<Invoice, Invoice>>;
  updateCurrentInvoiceForm: (
    toBeUpdated:
      | "NEW_INVOICE"
      | "INVOICE_FORM"
      | "BUYER_FORM"
      | "ITEM_FORM"
      | "NEW_ITEM"
      | "REMOVE_ITEM",
    field?:
      | keyof Invoice
      | keyof Invoice["buyer"]
      | keyof Invoice["items"][number],
    value?: string | number,
    index?: number // only for items
  ) => void;
};

export const InvoiceContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]); // all invoices (list view)
  const [currentInvoice, dispatch] = useReducer(InvoiceReducer, null); // reducer for current invoice (form view)

  // ### API Calls ###
  // --- Fetch all invoices ---
  const fetchInvoices = useApiCall(InvoiceApi.getAllInvoices, {
    onSuccess: (response) => {
      setInvoices(response.data);
      console.log("Fetched invoices:", response.data);
    },
  });
  // --- Create new invoice ---
  const createInvoice = useApiCall(InvoiceApi.addInvoice, {
    onSuccess: (response) => {
      setInvoices((prev) => [...prev, response.data]);
    },
  });
  // --- Fetch invoice by ID ---
  const fetchInvoiceById = useApiCall(InvoiceApi.getInvoiceById, {
    onSuccess: (response) => {
      dispatch({ type: "SET_INVOICE", payload: response.data });
    },
  });
  // --- Update invoice ---
  const updateInvoice = useApiCall(InvoiceApi.updateInvoice, {
    onSuccess: (response) => {
      dispatch({ type: "SET_INVOICE", payload: response.data });
    },
  });

  // ### Handlers ###
  // --- Update current invoice (locally in form view) ---
  const updateCurrentInvoiceForm = (
    toBeUpdated:
      | "NEW_INVOICE"
      | "INVOICE_FORM"
      | "BUYER_FORM"
      | "ITEM_FORM"
      | "NEW_ITEM"
      | "REMOVE_ITEM",
    field?:
      | keyof Invoice
      | keyof Invoice["buyer"]
      | keyof Invoice["items"][number],
    value?: string | number,
    index?: number // only for items
  ) => {
    switch (toBeUpdated) {
      // -- Initialize new invoice form --
      case "NEW_INVOICE": {
        const newInvoice = createNewInvoice();
        dispatch({ type: "SET_INVOICE", payload: newInvoice });
        break;
      }
      // -- Update invoice main field --
      case "INVOICE_FORM":
        dispatch({
          type: "UPDATE_INVOICE_FIELD",
          payload: { field: field as keyof Invoice, value },
        });
        break;
      // -- Update nested buyer field --
      case "BUYER_FORM":
        dispatch({
          type: "UPDATE_INVOICE_BUYER_FIELD",
          payload: { field: field as keyof Invoice["buyer"], value },
        });
        break;
      // -- Update nested items field --
      case "ITEM_FORM":
        if (currentInvoice) {
          dispatch({
            type: "UPDATE_INVOICE_ITEM_FIELD",
            payload: {
              index,
              field: field as keyof Invoice["items"][number],
              value,
            },
          });
        }
        break;
      // -- Add new item to items array --
      case "NEW_ITEM":
        dispatch({ type: "UPDATE_INVOICE_NEW_ITEM" });
        break;
      // -- Remove item from items array --
      case "REMOVE_ITEM":
        if (currentInvoice) {
          dispatch({
            type: "UPDATE_INVOICE_REMOVE_ITEM",
            payload: { index },
          });
        }
        break;
      default:
        break;
    }
  };

  const contextValue = {
    invoices,
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoice,
    currentInvoice,
    updateCurrentInvoiceForm,
  };

  return (
    <InvoiceContext.Provider value={contextValue}>
      {children}
    </InvoiceContext.Provider>
  );
};
