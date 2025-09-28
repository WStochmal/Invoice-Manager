// --- hooks ---
import { useInvoiceContext } from "@/hooks/useInvoicesContext";
import { useTranslation } from "@/hooks/useTranslation";

// --- style ---
import style from "./ItemsSection.module.css";
import tableStyle from "@/styles/sharedTableStyle.module.css";

// --- icons ---
import icon_add from "@/assets/icons/add.png";
import icon_delete from "@/assets/icons/delete.png";

const ItemsSection = () => {
  const { currentInvoice, updateCurrentInvoiceForm } = useInvoiceContext();
  const { getText } = useTranslation();

  if (!currentInvoice) return null;

  // --- Handler for adding new item ---
  const handleAddNewItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    updateCurrentInvoiceForm("NEW_ITEM");
  };

  // --- Handler for deleting item ---
  const handleDeleteItem = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    updateCurrentInvoiceForm("REMOVE_ITEM", undefined, undefined, index);
  };

  return (
    <div className={style["items-section"]}>
      <table className={tableStyle["base-table"]}>
        <thead>
          <tr>
            <th className={tableStyle["tiny-column"]}>
              {getText("INVOICE_LP")}
            </th>
            <th className={tableStyle["large-column"]}>
              {getText("INVOICE_ITEM_DESCRIPTION")}
            </th>
            <th className={tableStyle["medium-column"]}>
              {getText("INVOICE_ITEM_QUANTITY")}
            </th>
            <th className={tableStyle["medium-column"]}>
              {getText("INVOICE_ITEM_UNIT_NET_PRICE")}
            </th>
            <th className={tableStyle["medium-column"]}>
              {getText("INVOICE_NET_PRICE")}
            </th>
            <th className={tableStyle["medium-column"]}>
              {getText("INVOICE_ITEM_VAT_RATE")}
            </th>
            <th className={tableStyle["medium-column"]}>
              {getText("INVOICE_VAT_PRICE")}
            </th>
            <th className={tableStyle["medium-column"]}>
              {getText("INVOICE_GROSS_PRICE")}
            </th>
            <th className={tableStyle["tiny-column"]}></th>
          </tr>
        </thead>
        <tbody>
          {/* --- Map items --- */}
          {currentInvoice.items.length > 0 &&
            currentInvoice.items.map((item, key) => (
              <tr key={key}>
                <td className={tableStyle["tiny-column"]}>{key + 1}</td>
                <td className={tableStyle["large-column"]}>
                  <input
                    required
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateCurrentInvoiceForm(
                        "ITEM_FORM",
                        "description",
                        e.target.value,
                        key
                      )
                    }
                  />
                </td>
                <td className={tableStyle["medium-column"]}>
                  <input
                    required
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) =>
                      updateCurrentInvoiceForm(
                        "ITEM_FORM",
                        "quantity",
                        Number(e.target.value),
                        key
                      )
                    }
                  />
                </td>
                <td className={tableStyle["medium-column"]}>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={item.unitNetPrice}
                    onChange={(e) =>
                      updateCurrentInvoiceForm(
                        "ITEM_FORM",
                        "unitNetPrice",
                        Number(e.target.value),
                        key
                      )
                    }
                  />
                </td>
                <td className={tableStyle["medium-column"]}>
                  {item.netPrice.toFixed(2)}
                </td>
                <td className={tableStyle["medium-column"]}>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={item.vatRate}
                    onChange={(e) =>
                      updateCurrentInvoiceForm(
                        "ITEM_FORM",
                        "vatRate",
                        Number(e.target.value),
                        key
                      )
                    }
                  />
                </td>
                <td className={tableStyle["medium-column"]}>
                  {item.vatPrice.toFixed(2)}
                </td>
                <td className={tableStyle["medium-column"]}>
                  {item.grossPrice.toFixed(2)}
                </td>
                <td className={tableStyle["tiny-column"]}>
                  <button
                    className={tableStyle["table-button"]}
                    title={getText("DELETE_ITEM")}
                    onClick={(e) => handleDeleteItem(e, key)}
                  >
                    <img src={icon_delete} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr className={style["totals-row"]}>
            <td colSpan={1}>
              <button
                className={style["add-item"]}
                onClick={handleAddNewItem}
                title={getText("ADD_ITEM")}
              >
                <img src={icon_add} alt="Add Line" />
              </button>
            </td>
            <td colSpan={2} style={{ textAlign: "right" }}>
              Total
            </td>
            <td></td>
            <td>{currentInvoice.totalNetPrice.toFixed(2)}</td>
            <td></td>
            <td>{currentInvoice.totalVatPrice.toFixed(2)}</td>
            <td>{currentInvoice.totalGrossPrice.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ItemsSection;
