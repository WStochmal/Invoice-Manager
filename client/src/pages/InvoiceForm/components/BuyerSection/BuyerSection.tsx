// --- hooks ---
import { useInvoiceContext } from "@/hooks/useInvoicesContext";
import { useTranslation } from "@/hooks/useTranslation";

// --- style ---
import style from "./BuyerSection.module.css";

const BuyerSection = () => {
  const { currentInvoice, updateCurrentInvoiceForm } = useInvoiceContext();
  const { getText } = useTranslation();

  if (!currentInvoice) return null;

  return (
    <div className={style["buyer-section-content"]}>
      <div className={style["buyer-data"]}>
        <h3>{getText("INVOICE_BUYER_TITLE")}</h3>
        <span>
          <label htmlFor="buyer-name">{getText("INVOICE_BUYER_NAME")}</label>
          <input
            required
            type="text"
            value={currentInvoice.buyer.name}
            onChange={(e) =>
              updateCurrentInvoiceForm("BUYER_FORM", "name", e.target.value)
            }
          />
        </span>

        <span>
          <label htmlFor="buyer-NIP">{getText("INVOICE_BUYER_NIP")}</label>
          <input
            required
            type="text"
            minLength={10}
            maxLength={10}
            value={currentInvoice.buyer.NIP}
            onChange={(e) =>
              updateCurrentInvoiceForm("BUYER_FORM", "NIP", e.target.value)
            }
          />
        </span>

        <span>
          <label htmlFor="buyer-street">
            {getText("INVOICE_BUYER_STREET")}
          </label>
          <input
            required
            type="text"
            value={currentInvoice.buyer.street}
            onChange={(e) =>
              updateCurrentInvoiceForm("BUYER_FORM", "street", e.target.value)
            }
          />
        </span>

        <span>
          <label htmlFor="buyer-postalCode">
            {getText("INVOICE_BUYER_POSTAL_CODE")}
          </label>
          <input
            required
            type="text"
            value={currentInvoice.buyer.postalCode}
            onChange={(e) =>
              updateCurrentInvoiceForm(
                "BUYER_FORM",
                "postalCode",
                e.target.value
              )
            }
          />
        </span>

        <span>
          <label htmlFor="buyer-city">{getText("INVOICE_BUYER_CITY")}</label>
          <input
            required
            type="text"
            value={currentInvoice.buyer.city}
            onChange={(e) =>
              updateCurrentInvoiceForm("BUYER_FORM", "city", e.target.value)
            }
          />
        </span>
      </div>

      <div className={style["invoice-dates"]}>
        <h3>{getText("INVOICE_DATES_TITLE")}</h3>
        <span>
          <label htmlFor="issue-date">{getText("INVOICE_ISSUE_DATE")}</label>
          <input
            required
            type="date"
            value={currentInvoice.issueDate}
            onChange={(e) =>
              updateCurrentInvoiceForm(
                "INVOICE_FORM",
                "issueDate",
                e.target.value
              )
            }
          />
        </span>
        <span>
          <label htmlFor="due-date">{getText("INVOICE_DUE_DATE")}</label>
          <input
            required
            type="date"
            value={currentInvoice.dueDate}
            onChange={(e) =>
              updateCurrentInvoiceForm(
                "INVOICE_FORM",
                "dueDate",
                e.target.value
              )
            }
          />
        </span>
      </div>
    </div>
  );
};

export default BuyerSection;
