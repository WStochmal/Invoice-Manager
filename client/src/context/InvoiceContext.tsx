// --- libs ---
import React, { createContext, useReducer, useRef, useState } from "react";

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
  updateFilters: (field: string, value: string) => void;
  currentInvoice: Invoice | null;
  fetchInvoices: ReturnType<typeof useApiCall<Invoice[], void>>;
  fetchInvoiceById: ReturnType<typeof useApiCall<Invoice, string>>;
  createInvoice: ReturnType<typeof useApiCall<Invoice, Invoice>>;
  updateInvoice: ReturnType<typeof useApiCall<Invoice, Invoice>>;
  deleteInvoice: ReturnType<typeof useApiCall<void, string>>;
  toggleFavoriteInvoice: ReturnType<typeof useApiCall<Invoice, string>>;
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
      | keyof Invoice["items"][number]
      | Invoice,
    value?: string | number,
    index?: number // only for items
  ) => void;
};

type Filters = {
  search?: string;
  issueDate?: string;
  dueDate?: string;
  status?: string;
};

// ### Invoice Context Provider ###
export const InvoiceContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]); // all invoices (list view)
  const [currentInvoice, dispatch] = useReducer(InvoiceReducer, null); // reducer for current invoice (form view)

  const [filters, setFilters] = useState<Filters>({
    search: "",
    issueDate: "",
    dueDate: "",
    status: "",
  });

  const updateFilters = (field: string, value: string) => {
    setFilters((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "search" && value.length > 0 && value.length < 3) {
        return updated; // nie wywołuj API
      }

      fetchInvoicesWithFilters(updated);
      return updated;
    });
  };

  const fetchInvoicesWithFilters = (filters: Filters) => {
    fetchInvoices.execute({
      search: filters.search,
      issueDate: filters.issueDate,
      dueDate: filters.dueDate,
      status: filters.status,
    });
  };

  // ### API Calls ###
  // --- Fetch all invoices ---
  const fetchInvoices = useApiCall(InvoiceApi.getInvoices, {
    onSuccess: (response) => {
      setInvoices(response.data);
      console.log("Fetched invoices:", response.data);
    },
  });
  // --- Create new invoice ---
  const createInvoice = useApiCall(InvoiceApi.addInvoice, {
    onSuccess: (response, context) => {
      if (context === "FORM_EDITOR") {
        dispatch({ type: "SET_INVOICE", payload: response.data });
      } else if (context === "INVOICE_LIST") {
        setInvoices((prev) => [...prev, response.data]);
      }
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

  // --- Delete invoice ---
  const deleteInvoice = useApiCall(InvoiceApi.deleteInvoice, {
    onSuccess: (response, context) => {
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== context));
    },
  });

  // --- Toggle favorite status ---
  const toggleFavoriteInvoice = useApiCall(InvoiceApi.toggleFavorite, {
    onSuccess: (response) => {
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === response.data.id ? response.data : inv))
      );
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
      | keyof Invoice["items"][number]
      | Invoice,
    value?: string | number,
    index?: number // only for items
  ) => {
    switch (toBeUpdated) {
      // -- Initialize new invoice form --
      case "NEW_INVOICE": {
        const newInvoice =
          typeof field === "object" ? field : createNewInvoice();
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
    updateFilters,
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoice,
    currentInvoice,
    deleteInvoice,
    updateCurrentInvoiceForm,
    toggleFavoriteInvoice,
  };

  return (
    <InvoiceContext.Provider value={contextValue}>
      {children}
    </InvoiceContext.Provider>
  );
};
