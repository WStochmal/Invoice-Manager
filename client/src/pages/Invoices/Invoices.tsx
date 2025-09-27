// -- lib --
import React, { useEffect, useState } from "react";

// --- style ---
import style from "./Invoices.module.css";

// --- hooks ---
import { useModalContext } from "@/hooks/useModalContext";
import { useInvoiceContext } from "@/hooks/useInvoicesContext";

// --- components ---
import InvoiceListHeader from "./components/InvoiceListHeader/InvoiceListHeader";
import Loader from "@/components/common/Loader/Loader";
import InvoiceListTable from "./components/InvoiceListTable/InvoiceListTable";

const Invoices = () => {
  const { invoices, fetchInvoices } = useInvoiceContext();
  const { openModal } = useModalContext();

  useEffect(() => {
    fetchInvoices.execute();
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
      <InvoiceListHeader openModal={() => openModal("NEW_INVOICE")} />

      <div className={style["invoice-list-container"]}>
        {/* LOADER / ERROR / EMPTY INVOICES LIST */}
        {fetchInvoices.isLoading && <Loader />}
        {fetchInvoices.isError && <div>{fetchInvoices.messageCode}</div>}
        {/* {!isLoading && !isError && invoices.length === 0 && (
          <div>No invoices found.</div>
        )} */}
        {/* Tabele */}
        {!fetchInvoices.isLoading &&
          !fetchInvoices.isError &&
          invoices.length > 0 && (
            <>
              <InvoiceListTable
                invoices={favoriteInvoices}
                deleteInvoice={() => {}}
                title="Pinned Invoices"
              />
              <InvoiceListTable
                invoices={otherInvoices}
                deleteInvoice={() => {}}
                title="Invoices"
              />
            </>
          )}
      </div>
    </div>
  );
};

export default Invoices;
