// --- lib ---
import React, { useRef } from "react";

// --- style ---
import style from "./InvoiceListHeader.module.css";

// --- icons ---
import icon_add from "@/assets/icons/add.png";
import icon_search from "@/assets/icons/search.png";

// --- hooks ---
import { useModalContext } from "@/hooks/useModalContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useInvoiceContext } from "@/hooks/useInvoicesContext";

const InvoiceListHeader = () => {
  const { openModal } = useModalContext();
  const { updateFilters } = useInvoiceContext();
  const searchRef = useRef(null);

  const { getText } = useTranslation();
  return (
    <header className={style["invoices-header"]}>
      <div className={style["header-top-bar"]}>
        <h2>{getText("INVOICES_LIST_HEADER")}</h2>
        <button
          className={style["add-invoice-button"]}
          onClick={() => openModal({ type: "NEW_INVOICE", actionType: null })}
          title={getText("INVOICES_ADD_NEW")}
        >
          <img src={icon_add} alt="Add Icon" className="inverted-color" />
        </button>
      </div>
      <div className={style["header-actions"]}>
        <span
          className={`${style["input-wrapper"]} ${style["search-wrapper"]}`}
        >
          <input
            type="text"
            placeholder={getText("SEARCH")}
            ref={searchRef}
            onChange={(e) => updateFilters("search", e.target.value)}
          />
          <img src={icon_search} alt="Search Icon" />
        </span>
        <span className={style["input-wrapper"]}>
          <input
            type="date"
            placeholder="Filter by issue date"
            onChange={(e) => updateFilters("issueDate", e.target.value)}
          />
        </span>
        <a>-</a>
        <span className={style["input-wrapper"]}>
          <input
            type="date"
            placeholder="Filter by due date"
            onChange={(e) => updateFilters("dueDate", e.target.value)}
          />
        </span>
        <span className={style["input-wrapper"]}>
          <select onChange={(e) => updateFilters("status", e.target.value)}>
            <option value="">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </span>
      </div>
    </header>
  );
};

export default InvoiceListHeader;
