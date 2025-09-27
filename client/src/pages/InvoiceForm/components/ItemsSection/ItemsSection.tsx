// --- hooks ---
import { useInvoiceContext } from "@/hooks/useInvoicesContext";

// --- style ---
import style from "./ItemsSection.module.css";

// --- icons ---
import icon_add from "@/assets/icons/add.png";
import icon_delete from "@/assets/icons/delete.png";

const ItemsSection = () => {
  const { currentInvoice, updateCurrentInvoiceForm } = useInvoiceContext();

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
      <table>
        <thead>
          <tr>
            <th className={style["col-small"]}>Lp.</th>
            <th className={style["col-large"]}>Item</th>
            <th className={style["col-medium"]}>Quantity</th>
            <th className={style["col-medium"]}>Unit Net Price</th>
            <th className={style["col-medium"]}>Net Price</th>
            <th className={style["col-medium"]}>VAT Rate</th>
            <th className={style["col-medium"]}>VAT Price</th>
            <th className={style["col-medium"]}>Gross Price</th>
            <th className={style["col-small"]}></th>
          </tr>
        </thead>
        <tbody>
          {/* --- Map items --- */}
          {currentInvoice.items.length > 0 &&
            currentInvoice.items.map((item, key) => (
              <tr key={key}>
                <td className={style["col-small"]}>{key + 1}</td>
                <td className={style["col-large"]}>
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
                <td className={style["col-medium"]}>
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
                <td className={style["col-medium"]}>
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
                <td className={style["col-medium"]}>
                  {item.netPrice.toFixed(2)}
                </td>
                <td className={style["col-medium"]}>
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
                <td className={style["col-medium"]}>
                  {item.vatPrice.toFixed(2)}
                </td>
                <td className={style["col-medium"]}>
                  {item.grossPrice.toFixed(2)}
                </td>
                <td className={style["col-small"]}>
                  <button
                    className={style["remove-item"]}
                    title="Remove item"
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
              <button className={style["add-item"]} onClick={handleAddNewItem}>
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
