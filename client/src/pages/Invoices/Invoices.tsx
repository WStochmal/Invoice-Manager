import React, { useEffect, useState } from "react";

import style from "./Invoices.module.css";

// icons

import icon_star from "@/assets/icons/star.png";
import icon_delete from "@/assets/icons/delete.png";
import icon_edit from "@/assets/icons/edit.png";
import icon_add from "@/assets/icons/add.png";
import icon_print from "@/assets/icons/print.png";

// hooks

import NewInvoiceModal from "@/components/modal/NewInvoiceModal";
import InvoiceListTable from "./components/InvoiceListTable/InvoiceListTable";

import { useInvoiceContext } from "@/hooks/useInvoicesContext";
import InvoiceListHeader from "./components/InvoiceListHeader/InvoiceListHeader";
import Loader from "@/components/common/Loader";

export const Invoices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { invoices, isLoading, isError, deleteInvoiceById, fetchAllInvoices } =
    useInvoiceContext();

  useEffect(() => {
    fetchAllInvoices();
  }, []);

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
      {/*  HEADER */}
      <InvoiceListHeader openModal={setIsModalOpen} />

      <div className={style["invoice-list-container"]}>
        {/* LOADER / ERROR / EMPTY INVOICES LIST */}
        {isLoading && <Loader />}
        {isError && <div>Error loading invoices.</div>}
        {!isLoading && !isError && invoices.length === 0 && (
          <div>No invoices found.</div>
        )}
        {/* Tabele */}
        {!isLoading && !isError && invoices.length > 0 && (
          <>
            <InvoiceListTable
              invoices={favoriteInvoices}
              deleteInvoice={deleteInvoiceById}
              title="Favorite Invoices"
            />
            <InvoiceListTable
              invoices={otherInvoices}
              deleteInvoice={deleteInvoiceById}
              title="Other Invoices"
            />
          </>
        )}
      </div>
      {/* Modal */}
      <NewInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
