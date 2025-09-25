import React, { createContext, useState } from "react";
import type { Invoice } from "@/types/Invoice.type";
import { InvoiceApi } from "@/api/invoiceApi";

export const InvoiceContext = createContext<InvoiceContextProps | undefined>(
  undefined
);

type InvoiceContextProps = {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  isLoading: boolean;
  isError: boolean;
  messageCode: string | null;
  fetchAllInvoices: () => Promise<void>;
  fetchInvoiceById: (id: string) => Promise<Invoice | null>;
  deleteInvoiceById: (id: string) => Promise<void>;
  createInvoice: (invoice: Partial<Invoice>) => Promise<Invoice | null>;
  updateInvoice: (
    id: string,
    invoice: Partial<Invoice>
  ) => Promise<Invoice | null>;
};

export const InvoiceContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [messageCode, setMessageCode] = useState<string | null>(null);

  const fetchAllInvoices = async () => {
    try {
      setIsLoading(true);
      const res = await InvoiceApi.getAllInvoices();

      // await new Promise((resolve) => setTimeout(resolve, 10000));
      setInvoices(res.data);
    } catch (err) {
      setIsError(true);
      setMessageCode((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInvoiceById = async (id: string) => {
    try {
      setIsLoading(true);
      await InvoiceApi.deleteInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err) {
      setIsError(true);
      setMessageCode((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        currentInvoice,
        isLoading,
        isError,
        messageCode,
        fetchAllInvoices,
        fetchInvoiceById: async (id: string) => null,
        deleteInvoiceById,
        createInvoice: async (invoice) => null,
        updateInvoice: async (id, invoice) => null,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
