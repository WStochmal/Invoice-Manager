import type { Invoice } from "@/types/Invoice.type";
import React from "react";

import style from "./InvoiceListTable.module.css";

import icon_star from "@/assets/icons/star.png";
import icon_delete from "@/assets/icons/delete.png";
import icon_edit from "@/assets/icons/edit.png";

import icon_print from "@/assets/icons/print.png";
import { useNavigate } from "react-router-dom";
import CollapseWrapper from "@/components/common/CollapseWrapper/CollapseWrapper";

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
  const navigate = useNavigate();

  if (invoices.length === 0) {
    return null;
  }
  return (
    <CollapseWrapper title={title} defaultCollapsed={false}>
      <table className={style["invoice-table"]}>
        <thead>
          <tr>
            <th className={style["small-column"]}></th>
            <th className={style["small-column"]}>Lp.</th>
            <th className={style["medium-column"]}>Issue Date</th>
            <th className={style["medium-column"]}>Invoice Number</th>
            <th className={style["medium-column"]}>Buyer</th>
            <th className={style["medium-column"]}>Net Amount</th>
            <th className={style["small-column"]}></th>
            <th className={style["small-column"]}></th>
            <th className={style["small-column"]}></th>
            <th className={style["small-column"]}></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={invoice.id} className={style["invoice-list-row"]}>
              <td>
                <div
                  className={`${style["icon-column"]} ${style["small-column"]}`}
                >
                  <img
                    src={icon_star}
                    alt="Star Icon"
                    style={{ opacity: invoice.favorite ? 1 : 0.2 }}
                  />
                </div>
              </td>
              <td className={style["small-column"]}>{index + 1}</td>
              <td className={style["medium-column"]}>{invoice.issueDate}</td>
              <td className={style["medium-column"]}>
                {invoice.invoiceNumber}
              </td>
              <td className={style["medium-column"]}>{invoice.buyer.name}</td>
              <td className={style["medium-column"]}>
                {invoice.totalNetPrice}
              </td>
              <td>
                <div
                  className={`${style["icon-column"]} ${style["small-column"]}`}
                >
                  <span
                    className={`${style["invoice-paid-status"]} ${
                      style[`paid-status-${invoice.status.toLowerCase()}`]
                    }`}
                  ></span>
                </div>
              </td>
              <td>
                <div
                  className={`${style["icon-column"]} ${style["small-column"]}`}
                >
                  <img
                    src={icon_print}
                    alt="Print Icon"
                    title="Print Invoice"
                  />
                </div>
              </td>
              <td>
                <div
                  className={`${style["icon-column"]} ${style["small-column"]}`}
                >
                  <button
                    className={style["invoice-row-button"]}
                    onClick={() => navigate(`/invoices/form/${invoice.id}`)}
                  >
                    <img src={icon_edit} alt="Edit Icon" title="Edit Invoice" />
                  </button>
                </div>
              </td>
              <td>
                <div
                  className={`${style["icon-column"]} ${style["small-column"]}`}
                >
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
    </CollapseWrapper>
  );
};

export default InvoiceListTable;
