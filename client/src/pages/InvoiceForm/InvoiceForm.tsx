import { InvoiceApi } from "@/api/invoiceApi";
import { useInvoices } from "@/hooks/useInvoices";
import { useInvoiceContext } from "@/hooks/useInvoicesContext";
import type { Invoice } from "@/types/Invoice.type";
import React, { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const InvoiceForm = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const { isLoading, isError, fetchInvoiceById } = useInvoiceContext();
  useEffect(() => {
    if (id) {
      fetchInvoiceById(id).then((data) => setInvoice(data));
    }
  }, [id]);
  return (
    <div>
      <h3>Invoice Form</h3>
    </div>
  );
};

export default InvoiceForm;
