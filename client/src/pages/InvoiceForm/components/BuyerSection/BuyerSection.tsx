// --- hooks ---
import { useInvoiceContext } from "@/hooks/useInvoicesContext";

// --- style ---
import style from "./BuyerSection.module.css";

const BuyerSection = () => {
  const { currentInvoice, updateCurrentInvoiceForm } = useInvoiceContext();

  if (!currentInvoice) return null;

  return (
    <div className={style["buyer-section-content"]}>
      <div className={style["buyer-data"]}>
        <h3>Buyer information</h3>
        <span>
          <label htmlFor="buyer-name">Company name</label>
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
          <label htmlFor="buyer-NIP">NIP</label>
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
          <label htmlFor="buyer-street">Street</label>
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
          <label htmlFor="buyer-postalCode">Postal Code</label>
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
          <label htmlFor="buyer-city">City</label>
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
        <h3>Invoice Dates</h3>
        <span>
          <label htmlFor="issue-date">Issue Date</label>
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
          <label htmlFor="due-date">Due Date</label>
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
