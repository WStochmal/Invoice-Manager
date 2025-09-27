// --- hooks ---
import { useInvoiceContext } from "@/hooks/useInvoicesContext";

// --- style ---
import style from "./SummarySection.module.css";

const SummarySection = () => {
  const { currentInvoice, updateCurrentInvoiceForm } = useInvoiceContext();

  if (!currentInvoice) return null;

  return (
    <div className={style["summary-section"]}>
      <div className={style["notes"]}>
        <label>Additional Notes</label>
        <textarea
          value={currentInvoice.additionalNotes}
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
          <label>Total Net Price</label>
          <span>
            {currentInvoice.totalNetPrice.toFixed(2)} {currentInvoice.currency}
          </span>
        </div>
        <div className={style["total"]}>
          <label>Total VAT</label>
          <span>
            {currentInvoice.totalVatPrice.toFixed(2)} {currentInvoice.currency}
          </span>
        </div>
        <div className={style["total-gross"]}>
          <label>Total Gross Price</label>
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
