import React, { useRef } from "react";
import style from "./InvoiceListHeader.module.css";
import icon_add from "@/assets/icons/add.png";
import icon_search from "@/assets/icons/search.png";
const InvoiceListHeader = ({ openModal }) => {
  const searchRef = useRef(null);
  return (
    <header className={style["invoices-header"]}>
      <div className={style["header-top-bar"]}>
        <h2>Invoices</h2>
        <button
          className={style["add-invoice-button"]}
          onClick={() => openModal(true)}
        >
          <img src={icon_add} alt="Add Icon" className="inverted-color" />
        </button>
      </div>
      <div className={style["header-actions"]}>
        <span
          className={`${style["input-wrapper"]} ${style["search-wrapper"]}`}
        >
          <input type="text" placeholder="Search..." ref={searchRef} />
          <img src={icon_search} alt="Search Icon" />
        </span>
        <span className={style["input-wrapper"]}>
          <input type="date" placeholder="Filter by issue date" />
        </span>
        <a>-</a>
        <span className={style["input-wrapper"]}>
          <input type="date" placeholder="Filter by due date" />
        </span>
        <span className={style["input-wrapper"]}>
          <select>
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
