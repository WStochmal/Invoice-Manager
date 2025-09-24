import type { Invoice } from "@/types/Invoice.type";
import React from "react";

import style from "../Invoices.module.css";

import icon_star from "@/assets/icons/star.png";
import icon_delete from "@/assets/icons/delete.png";
import icon_edit from "@/assets/icons/edit.png";

import icon_print from "@/assets/icons/print.png";

type InvoiceListTableProps = {
  invoices: Invoice[];
  deleteInvoice: (id: string) => void;
  title: string;
};
const InvoiceListTable: React.FC<InvoiceListTableProps> = ({
  invoices,
  deleteInvoice,
  title,
}) => {
  return (
    <>
      <h2>{title}</h2>
      <table className={style["invoice-list"]}>
        <thead>
          <tr>
            <th></th>
            <th>Lp.</th>
            <th>Issue Date</th>
            <th>Invoice Number</th>
            <th>Buyer</th>
            <th>Total Amount (Net)</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={invoice.id}>
              <td>
                <div className={style["invoice-table-cell-with-icon"]}>
                  <img
                    src={icon_star}
                    alt="Star Icon"
                    style={{ opacity: invoice.favorite ? 1 : 0.2 }}
                  />
                </div>
              </td>
              <td>{index + 1}</td>
              <td>{invoice.issueDate}</td>
              <td>{invoice.invoiceNumber}</td>
              <td>{invoice.buyer.name}</td>
              <td>{invoice.totalNetPrice}</td>
              <td>
                <div className={style["invoice-table-cell-with-icon"]}>
                  <span
                    className={`${style["invoice-paid-status"]} ${
                      style[`paid-status-${invoice.status.toLowerCase()}`]
                    }`}
                  ></span>
                </div>
              </td>
              <td>
                <div className={style["invoice-table-cell-with-icon"]}>
                  <img
                    src={icon_print}
                    alt="Print Icon"
                    title="Print Invoice"
                  />
                </div>
              </td>
              <td>
                <div className={style["invoice-table-cell-with-icon"]}>
                  <img src={icon_edit} alt="Edit Icon" title="Edit Invoice" />
                </div>
              </td>
              <td>
                <div className={style["invoice-table-cell-with-icon"]}>
                  <img
                    src={icon_delete}
                    alt="Delete Icon"
                    title="Delete Invoice"
                    onClick={() => deleteInvoice(invoice.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default InvoiceListTable;
