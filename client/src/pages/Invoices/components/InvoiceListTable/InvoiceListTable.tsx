// -- lib --
import React from "react";
import { useNavigate } from "react-router-dom";

// --- styles ---
import style from "./InvoiceListTable.module.css";
import tableStyle from "@/styles/sharedTableStyle.module.css";

// --- icons ---
import icon_star from "@/assets/icons/star.png";
import icon_star_filled from "@/assets/icons/star_filled.png";
import icon_delete from "@/assets/icons/delete.png";
import icon_edit from "@/assets/icons/edit.png";
import icon_print from "@/assets/icons/print.png";

// --- components ---
import CollapseWrapper from "@/components/common/CollapseWrapper/CollapseWrapper";

// --- hooks ---
import { useModalContext } from "@/hooks/useModalContext";
import { useInvoiceContext } from "@/hooks/useInvoicesContext";

// --- types ---
import type { Invoice } from "@/types/Invoice.type";
import { useTranslation } from "@/hooks/useTranslation";

type InvoiceListTableProps = {
  invoices: Invoice[];
  title: string;
};

// ### Invoice List Table Component ###
const InvoiceListTable: React.FC<InvoiceListTableProps> = ({
  invoices,
  title,
}) => {
  const navigate = useNavigate();
  const { openModal } = useModalContext();
  const { getText } = useTranslation();
  const { toggleFavoriteInvoice } = useInvoiceContext();

  if (invoices.length === 0) {
    return null;
  }
  return (
    <CollapseWrapper title={title} defaultCollapsed={false}>
      <table className={tableStyle["base-table"]}>
        <thead>
          <tr>
            <th className={tableStyle["tiny-column"]}></th>
            <th className={tableStyle["tiny-column"]}>
              {getText("INVOICE_LP")}
            </th>
            <th className={tableStyle["medium-column"]}>
              {getText("INVOICE_ISSUE_DATE")}
            </th>
            <th className={tableStyle["medium-column"]}>
              {getText("INVOICE_NUMBER")}
            </th>
            <th className={tableStyle["large-column"]}>
              {getText("INVOICE_BUYER")}
            </th>
            <th className={tableStyle["medium-column"]}>
              {getText("INVOICE_NET_AMOUNT")}
            </th>
            <th className={tableStyle["col-tiny"]}></th>
            <th className={tableStyle["col-tiny"]}></th>
            <th className={tableStyle["col-tiny"]}></th>
            <th className={tableStyle["col-tiny"]}></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={invoice.id} className={style["invoice-list-row"]}>
              <td className={tableStyle["tiny-column"]}>
                <button
                  className={tableStyle["table-button"]}
                  onClick={() => toggleFavoriteInvoice.execute(invoice.id)}
                  title={invoice.favorite ? "Unpin invoice" : "Pin invoice"}
                >
                  <img
                    src={invoice.favorite ? icon_star_filled : icon_star}
                    alt="Pinned invoice"
                  />
                </button>
              </td>
              <td className={tableStyle["tiny-column"]}>{index + 1}</td>
              <td className={tableStyle["medium-column"]}>
                {invoice.issueDate}
              </td>
              <td className={tableStyle["medium-column"]}>
                {invoice.invoiceNumber}
              </td>
              <td className={tableStyle["large-column"]}>
                {invoice.buyer.name}
              </td>
              <td className={tableStyle["medium-column"]}>
                {invoice.totalNetPrice}
              </td>
              <td className={tableStyle["small-column"]}>
                <span
                  className={`${style["invoice-paid-status"]} ${
                    style[`paid-status-${invoice.status.toLowerCase()}`]
                  }`}
                ></span>
              </td>
              <td className={tableStyle["tiny-column"]}>
                <button className={tableStyle["table-button"]}>
                  <img
                    src={icon_print}
                    alt="Print Icon"
                    title="Print Invoice"
                  />
                </button>
              </td>

              <td className={tableStyle["tiny-column"]}>
                <button
                  className={tableStyle["table-button"]}
                  onClick={() => navigate(`/invoices/form/${invoice.id}`)}
                >
                  <img
                    src={icon_edit}
                    alt="Edit Icon"
                    title="Open invoice in form"
                  />
                </button>
              </td>
              <td className={tableStyle["tiny-column"]}>
                <button className={tableStyle["table-button"]}>
                  <img
                    src={icon_delete}
                    alt="Delete Icon"
                    title="Delete Invoice"
                    onClick={() =>
                      openModal({
                        type: "CONFIRM_ACTION",
                        actionType: "DELETE_INVOICE",
                        invoiceId: invoice.id,
                      })
                    }
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CollapseWrapper>
  );
};

export default InvoiceListTable;
