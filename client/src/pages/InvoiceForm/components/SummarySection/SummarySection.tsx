// --- hooks ---
import { useInvoiceContext } from "@/hooks/useInvoicesContext";
import { useTranslation } from "@/hooks/useTranslation";

// --- style ---
import style from "./SummarySection.module.css";

const SummarySection = () => {
  const { currentInvoice, updateCurrentInvoiceForm } = useInvoiceContext();
  const { getText } = useTranslation();

  if (!currentInvoice) return null;

  return (
    <div className={style["summary-section"]}>
      <div className={style["notes"]}>
        <label>{getText("INVOICE_ADDITIONAL_NOTES")}</label>
        <textarea
          value={currentInvoice.additionalNotes || ""}
          onChange={(e) =>
            updateCurrentInvoiceForm(
              "INVOICE_FORM",
              "additionalNotes",
              e.target.value
            )
          }
        />
      </div>
      <div className={style["totals"]}>
        <div className={style["total"]}>
          <label>{getText("INVOICE_NET_PRICE")}</label>
          <span>
            {currentInvoice.totalNetPrice.toFixed(2)} {currentInvoice.currency}
          </span>
        </div>
        <div className={style["total"]}>
          <label>{getText("INVOICE_VAT_PRICE")}</label>
          <span>
            {currentInvoice.totalVatPrice.toFixed(2)} {currentInvoice.currency}
          </span>
        </div>
        <div className={style["total-gross"]}>
          <label>{getText("INVOICE_GROSS_PRICE")}</label>
          <span className={style["total-gross-price"]}>
            {currentInvoice.totalGrossPrice.toFixed(2)}{" "}
            {currentInvoice.currency}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
