// -- lib --
import React, { useEffect, useState } from "react";

// --- style ---
import style from "./Invoices.module.css";

// --- hooks ---
import { useModalContext } from "@/hooks/useModalContext";
import { useInvoiceContext } from "@/hooks/useInvoicesContext";
import { useTranslation } from "@/hooks/useTranslation";

// --- components ---
import InvoiceListHeader from "./components/InvoiceListHeader/InvoiceListHeader";
import Loader from "@/components/common/Loader/Loader";
import InvoiceListTable from "./components/InvoiceListTable/InvoiceListTable";

const Invoices = () => {
  const { invoices, fetchInvoices } = useInvoiceContext();
  const { openModal } = useModalContext();

  const { getText } = useTranslation();

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
        {fetchInvoices.isError && (
          <div className={style["error-message"]}>
            {getText(fetchInvoices.messageCode)}
          </div>
        )}

        {/* Tabele */}
        {!fetchInvoices.isLoading &&
          !fetchInvoices.isError &&
          invoices.length > 0 && (
            <>
              <InvoiceListTable
                invoices={favoriteInvoices}
                title={getText("INVOICE_TABLE_TITLE_PINNED")}
              />
              <InvoiceListTable
                invoices={otherInvoices}
                title={getText("INVOICE_TABLE_TITLE_OTHERS")}
              />
            </>
          )}
        {invoices.length === 0 && <p>{getText("EMPTY_INVOICE_LIST")}</p>}
      </div>
    </div>
  );
};

export default Invoices;
