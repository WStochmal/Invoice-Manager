import React, { useState } from "react";

import style from "./Invoices.module.css";

// icons

import icon_star from "@/assets/icons/star.png";
import icon_delete from "@/assets/icons/delete.png";
import icon_edit from "@/assets/icons/edit.png";
import icon_add from "@/assets/icons/add.png";
import icon_print from "@/assets/icons/print.png";

// hooks
import { useInvoices } from "@/hooks/useInvoices";
import NewInvoiceModal from "@/components/modal/NewInvoiceModal";
import InvoiceListTable from "./components/InvoiceListTable";

export const Invoices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { invoices, isLoading, isError, deleteInvoice } = useInvoices();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {isError}</div>;

  const favoriteInvoices = invoices
    .filter((i) => i.favorite)
    .sort(
      (a, b) =>
        new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
    );

  const otherInvoices = invoices
    .filter((i) => !i.favorite)
    .sort(
      (a, b) =>
        new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
    );

  return (
    <div className={style["invoices"]}>
      <h1>Invoices Page</h1>
      <button
        className={style["add-invoice-button"]}
        onClick={() => setIsModalOpen(true)}
      >
        <img src={icon_add} alt="Add Icon" />
        Add New Invoice
      </button>
      <InvoiceListTable
        invoices={favoriteInvoices}
        deleteInvoice={deleteInvoice}
        title="Favorite Invoices"
      />
      <InvoiceListTable
        invoices={otherInvoices}
        deleteInvoice={deleteInvoice}
        title="Other Invoices"
      />
      <NewInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
