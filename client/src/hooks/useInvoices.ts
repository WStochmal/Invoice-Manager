import { InvoiceApi } from "@/api/invoiceApi";
import type { Invoice } from "@/types/Invoice.type";
import { useEffect, useState } from "react";

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);

  // Fetch invoices on mount
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        const invoices = await InvoiceApi.getAllInvoices();
        setInvoices(invoices.data);
      } catch (err) {
        setIsError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // Delete invoice by id
  const deleteInvoice = async (id: string) => {
    try {
      setIsLoading(true);
      await InvoiceApi.deleteInvoice(id);
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
    } catch (err) {
      setIsError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return { invoices, isLoading, isError, deleteInvoice };
};
